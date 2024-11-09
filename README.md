# Film service API

This is a NestJS project that provides an API to retrieve movie data by title. The service caches movie data in Redis and Node memory to optimize performance and reduce redundant database queries. The project uses NodeCache for in-memory caching, Redis for persistent caching, and TypeORM for database interaction.

## Features

- **Film Search**: Retrieve movie data by title from database.
- **Caching**: Caches movie data in Node (15 seconds TTL) and Redis (30 seconds TTL) memory.
- **Concurrent Request Handling**: Enables efficient handling of multiple concurrent requests for the same movie by waiting for the first request to complete before returning data.
- **Delay for testing**: Simulates a delay (customizable) to test the queuing behavior when multiple requests are received for the same movie.

## Requirements

- Node.js >= 18.x
- PostgreSQL database
- The Redis server is running

## Settings

Configure constants in the script:

```bash
recovery-db.sh
```

Creating an .env file from an .env.example file:

```bash
cp .env.example .env
```

## Installation

1. Clone the repository or upload the files.

```bash
git clone https://github.com/5-4-7-0-3/film-cache-app.git
```

2. Go to the project directory:

```bash
cd film-cache-app
```

3. Install the necessary dependencies:

```bash
install npm
```

4. Start the container:

```bash
docker-compose up -d
```

5. Run the bd copy script:

```bash
chmod +x restore-db.sh
./restore-db.sh
```

## Launching

To run the program, execute the command:

```bash
npm run start:dev
```

## Endpoints

```bash
GET /movie/:title
```

Get movie data by title.

1. Parameters:
- name (string): the name of the movie to be retrieved.
2. Answer:
- Returns movie data if found in cache or database.
- Caches data in Redis and Node memory for subsequent requests.

## Request example:

```bash
GET http://localhost:3000/film/Inception

```

## Example answer:

```bash
{
 "film": "(133,\"Chamber Italian\",\"A Fateful Reflection of a Moose And a Husband who must defeat a monkey in Nigeria\",2006,1,7,4.99,117,14.99,NC- 17 ,"2013-05-26 14:50:58.951",{Trailers},\"'chamber':1 'fate':4 'husband':11 'italian':2 'monkey':16 'moos' :8 'must':13 'nigeria':18 'overcom':14 'reflect':5\")"
}
```

## Caching behavior

1. The service first checks if the movie data is available in the Node memory.
2. If not found, Redis is checked.
3. If no cache contains data, it queries the PostgreSQL database.
4. Once the data is received, it is cached in Redis and Node memory for subsequent requests.

## Contact

- tg: https://t.me/vlad54703
- mail: vlad.kovalov2000@gmai.com
- linkedin: https://www.linkedin.com/in/vlad-kovalyov/
