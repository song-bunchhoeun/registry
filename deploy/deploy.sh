#!/bin/bash

# Set variables
DOCKER_IMAGE=$1
COMPOSE_FILE=$2
SERVICE_NAME=$3

# Backup the current docker-compose file
cp "$COMPOSE_FILE" "$COMPOSE_FILE.bak"

# Replace old tag with the new one
sed -i "0,/image:/s|image: .*|image: ${DOCKER_IMAGE}|" ${COMPOSE_FILE}

echo "Updated docker-compose.yml with new: $DOCKER_IMAGE"

# Pull the new image
docker compose -f $COMPOSE_FILE pull

# Start the services with the new image
docker compose -f $COMPOSE_FILE up -d

# Wait for 10 seconds and check container status
sleep 5
if ! docker ps --filter "name=$SERVICE_NAME" --filter "status=running" | grep -q "$SERVICE_NAME"; then
    echo "Deployment failed! Rolling back..."

    # Restore the previous docker-compose.yml
    mv "$COMPOSE_FILE.bak" "$COMPOSE_FILE"

    # Pull the previous image and restart services
    docker compose -f $COMPOSE_FILE pull
    docker compose -f $COMPOSE_FILE up -d
    echo "Rollback complete!"
else
    echo "Deployment successful!"

    # Remove backup file if deployment succeeded
    rm "$COMPOSE_FILE.bak"

    # Cleanup unused images
    docker image prune -f
fi
