#!/bin/bash

set -e

DOCKER_USERNAME="XXX"

FRONTEND_IMAGE_NAME="act1-frontend"
BACKEND_IMAGE_NAME="act1-backend"

TAG="latest"

FRONTEND_IMAGE="${DOCKER_USERNAME}/${FRONTEND_IMAGE_NAME}:${TAG}"
BACKEND_IMAGE="${DOCKER_USERNAME}/${BACKEND_IMAGE_NAME}:${TAG}"

# --- Build and Push Frontend Image ---
echo "Building frontend image: ${FRONTEND_IMAGE}..."
docker build -t "${FRONTEND_IMAGE}" -f front/Dockerfile ./front
echo "Pushing frontend image: ${FRONTEND_IMAGE}..."
docker push "${FRONTEND_IMAGE}"
echo "Frontend image built and pushed successfully: ${FRONTEND_IMAGE}"

# --- Build and Push Backend Image ---
echo "Building backend image: ${BACKEND_IMAGE}..."
docker build -t "${BACKEND_IMAGE}" -f back/Dockerfile ./back
echo "Pushing backend image: ${BACKEND_IMAGE}..."
docker push "${BACKEND_IMAGE}"
echo "Backend image built and pushed successfully: ${BACKEND_IMAGE}"

echo "-----------------------------------------------------"
echo "Build and push completed."
echo "Images pushed to Docker Hub:"
echo "  - ${FRONTEND_IMAGE}"
echo "  - ${BACKEND_IMAGE}"
echo "-----------------------------------------------------" 



