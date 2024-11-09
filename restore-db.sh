#!/bin/bash

POSTGRES_CONTAINER="postgres"
DB_NAME="dvdrental"
DB_USER="postgres"
TAR_FILE_PATH="./dvdrental.tar"

echo "Copying the file $TAR_FILE_PATH to the container $POSTGRES_CONTAINER..."
docker cp "$TAR_FILE_PATH" "$POSTGRES_CONTAINER:/tmp/dvdrental.tar"

echo "Checking the presence of the file in the container..."
docker exec -i "$POSTGRES_CONTAINER" ls /tmp/dvdrental.tar

if [ $? -eq 0 ]; then
 echo "The file was successfully copied to the container!"
else
 echo "File not found in container! Ending script."
 exit 1
fi

echo "Dropping database $DB_NAME if it exists..."
docker exec -i "$POSTGRES_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "Creating database $DB_NAME in PostgreSQL container..."
docker exec -i "$POSTGRES_CONTAINER" psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

echo "Recovering database $DB_NAME from archive /tmp/dvdrental.tar..."
docker exec -i "$POSTGRES_CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME" /tmp/dvdrental.tar

echo "Checking created tables in database $DB_NAME:"
docker exec -i "$POSTGRES_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "\dt"

echo "Database $DB_NAME successfully loaded and ready for use."