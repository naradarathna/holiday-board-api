#!/bin/sh

# Apply database migrations
npx prisma migrate deploy

# Start the application
exec "$@"