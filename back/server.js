const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Allow requests from frontend (adjust origin in production)
app.use(express.json()); // Parse JSON bodies

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        // Attempt to reconnect after a delay
        setTimeout(connectWithRetry, 5000);
    });

const connectWithRetry = () => {
    console.log('Retrying MongoDB connection...');
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => console.log('MongoDB Reconnected'))
        .catch(err => {
            console.error('MongoDB Connection Error:', err);
            setTimeout(connectWithRetry, 5000);
        });
};

// --- Database Schema and Model ---
const pointsSchema = new mongoose.Schema({
    // Using a fixed identifier to always update the same document
    identifier: { type: String, default: 'global_points', unique: true },
    value: { type: Number, default: 0, min: 0, max: 10 },
}, { timestamps: true });

// Ensure the document exists with default value if not found
pointsSchema.statics.getPoints = async function () {
    let pointsDoc = await this.findOne({ identifier: 'global_points' });
    if (!pointsDoc) {
        console.log("Points document not found, creating one with default value 0.");
        pointsDoc = await this.create({ identifier: 'global_points', value: 0 });
    }
    return pointsDoc;
};

const Points = mongoose.model('Points', pointsSchema);

// --- API Routes ---

// GET current points
app.get('/api/points', async (req, res) => {
    try {
        const pointsDoc = await Points.getPoints();
        res.json({ points: pointsDoc.value });
    } catch (err) {
        console.error("Error fetching points:", err);
        res.status(500).json({ message: 'Error fetching points', error: err.message });
    }
});

// Increment points
app.post('/api/points/increment', async (req, res) => {
    try {
        const pointsDoc = await Points.getPoints();
        if (pointsDoc.value < 10) {
            pointsDoc.value += 1;
            await pointsDoc.save();
            res.json({ points: pointsDoc.value, message: 'Points incremented' });
        } else {
            res.status(400).json({ points: pointsDoc.value, message: 'Maximum points reached (10)' });
        }
    } catch (err) {
        console.error("Error incrementing points:", err);
        res.status(500).json({ message: 'Error incrementing points', error: err.message });
    }
});

// Decrement points
app.post('/api/points/decrement', async (req, res) => {
    try {
        const pointsDoc = await Points.getPoints();
        if (pointsDoc.value > 0) {
            pointsDoc.value -= 1;
            await pointsDoc.save();
            res.json({ points: pointsDoc.value, message: 'Points decremented' });
        } else {
            res.status(400).json({ points: pointsDoc.value, message: 'Minimum points reached (0)' });
        }
    } catch (err) {
        console.error("Error decrementing points:", err);
        res.status(500).json({ message: 'Error decrementing points', error: err.message });
    }
});

// --- Start Server ---
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Closing MongoDB connection.');
    await mongoose.connection.close();
    console.log('MongoDB connection closed. Exiting.');
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Closing MongoDB connection.');
    await mongoose.connection.close();
    console.log('MongoDB connection closed. Exiting.');
    process.exit(0);
}); 