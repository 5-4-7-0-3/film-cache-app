#!/bin/bash

POSTGRES_CONTAINER="film-cache-app-postgres-1"
DB_NAME="dvdrental"
DB_USER="postgres"
TAR_FILE_PATH="./dvdrental.tar"

echo "Копіюємо файл $TAR_FILE_PATH у контейнер $POSTGRES_CONTAINER..."
docker cp "$TAR_FILE_PATH" "$POSTGRES_CONTAINER:/tmp/dvdrental.tar"

echo "Перевіряємо наявність файлу у контейнері..."
docker exec -i "$POSTGRES_CONTAINER" ls /tmp/dvdrental.tar

if [ $? -eq 0 ]; then
  echo "Файл успішно скопійовано в контейнер!"
else
  echo "Файл не знайдено в контейнері! Завершуємо роботу скрипта."
  exit 1
fi

echo "Видаляємо базу даних $DB_NAME, якщо вона існує..."
docker exec -i "$POSTGRES_CONTAINER" psql -U "$DB_USER" -c "DROP DATABASE IF EXISTS $DB_NAME;"

echo "Створюємо базу даних $DB_NAME у контейнері PostgreSQL..."
docker exec -it "$POSTGRES_CONTAINER" bash psql -U "$DB_USER" -c "CREATE DATABASE $DB_NAME;"

echo "Відновлюємо базу даних $DB_NAME з архіву /tmp/dvdrental.tar..."
docker exec -i "$POSTGRES_CONTAINER" pg_restore -U "$DB_USER" -d "$DB_NAME" /tmp/dvdrental.tar

echo "Перевірка створених таблиць у базі $DB_NAME:"
docker exec -i "$POSTGRES_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -c "\dt"

echo "База даних $DB_NAME успішно завантажена та готова до використання."
