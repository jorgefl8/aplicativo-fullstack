echo "Aplicando nuevos recursos en el orden correcto..."

# Asegúrate de que tus archivos YAML están en el directorio actual.
# Revisa los nombres de los archivos para que coincidan con los tuyos.

# 1. Secrets y ConfigMaps (para configuraciones y credenciales)
kubectl apply -f secret-app.yaml
kubectl apply -f configmap-app.yaml

# 2. Almacenamiento Persistente para MongoDB (necesario para Deployment)
kubectl apply -f pvc-mongodb.yaml

# 3. Deployment de MongoDB
kubectl apply -f deployment-mongodb.yaml

# 4. Servicio para MongoDB (para que el Backend se conecte)
kubectl apply -f service-mongodb.yaml

# 5. Deployment del Backend (Express.js)
kubectl apply -f deployment-backend.yaml

# 6. Servicio para el Backend (para que el Frontend se conecte)
kubectl apply -f service-backend.yaml

# 7. Deployment del Frontend (React)
kubectl apply -f deployment-frontend.yaml

# 8. Servicio para el Frontend (para exposición externa)
kubectl apply -f service-frontend.yaml

# 9. Network Policies (aplicar al final, una vez que la conectividad básica esté establecida)
kubectl apply -f network-policy-mongodb.yaml
kubectl apply -f network-policy-backend.yaml
kubectl apply -f network-policy-frontend.yaml

# (Opcional) Horizontal Pod Autoscaler
kubectl apply -f HorizontalPodAutoscaler.yaml

echo "Todos los recursos han sido aplicados. Verificando el estado de los pods..."
sleep 10 # Da un pequeño tiempo para que los pods empiecen a programarse

echo "Verificando el estado de los recursos..."
kubectl get pods -o wide
kubectl get services
kubectl get pvc

echo "Para acceder a la aplicación, obtén la URL del LoadBalancer:"
kubectl get service frontend-service -o wide
echo "La aplicación estará disponible en la EXTERNAL-IP del LoadBalancer (puede tardar unos minutos en aparecer)"
