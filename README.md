# Chess Game with online multiplayer functionality

This is a Chess game implemented in Typescript.

## Project Structure

The project has the following structure:

    .
    ├── backend/ 
    │   └── ...                                         # Backend files (current)
    │
    ├── frontend-ts/ 
    │   └── ...                                         # Frontend files (current)
    │
    └── frontend/ 
        └── ...                                         # frontend js files (old)


## (Method 1) Running the application with local Node.js

### Requirements

To run the game, you need to have Node.js, PostgreSQL server and Redis Stack Server installed on your machine. You can download Node.js from [here](https://nodejs.org/en/download/), PostgreSQL server from [here](https://www.postgresql.org/download/) and Redis Stack Server from [here](https://redis.io/download)

### Running the Backend

Firstly navigate to the backend directory:

```sh
cd backend
```

Then copy the .env.example file to .env and update the values if required as per your local setup:

```sh
cp .env.example .env
```

Then install the dependencies:

```sh
npm install
```

Then run the following command to start the server:

```sh
npm run dev
```

### Running the Frontend

Firstly navigate to the frontend-ts directory:

```sh
cd frontend-ts
```

Then copy the src/.env.example file to src/.env and update the values if required as per your local setup:

```sh
cp src/.env.example src/.env
```

Then install the dependencies:

```sh

Then install the dependencies:

```sh
npm install
```

Then run the following command to start the server:

```sh
npm run dev
```

This command starts the development server. Once the server is running, you can open your browser and navigate to the URL that the server is running on (usually http://localhost:5173 or similar). The application should load in your browser.

## (Method 2) Running the application with Docker Compose

### Requirements

To run the game, you need to have Docker and Docker Compose installed on your machine. You can download Docker from [here](https://www.docker.com/products/docker-desktop) and Docker Compose from [here](https://docs.docker.com/compose/install/)

### Running the Backend

Firstly navigate to the backend directory:

```sh
cd backend
```

Then copy the .env.example.docker file to .env and update the values if required as per your local setup:

```sh
cp .env.example.docker .env
```

Then run the following command to start the server:

```sh
docker-compose up -d
```

### Running the Frontend

Firstly navigate to the frontend-ts directory:

```sh
cd frontend-ts
```

Then copy the .env.example file to .env and update the values if required as per your local setup:

```sh
cp .env.example .env
```

If you are building for the production environment, then make sure to copy the .env.example file inside the frontend-ts/src directory to .env and update the values in it as well:

```sh
cp src/.env.example src/.env
```

Then run the following command to start the server:

```sh
docker-compose up -d
```

These command starts the development server. Once the server is running, you can open your browser and navigate to the URL that the server is running on (usually http://localhost:5173 or similar). The application should load in your browser.

## (Method 3) Running the application with single Docker Compose

### Requirements

To run the game, you need to have Docker and Docker Compose installed on your machine. You can download Docker from [here](https://www.docker.com/products/docker-desktop) and Docker Compose from [here](https://docs.docker.com/compose/install/)

### Running the application

Make sure you are at the root of the project directory. Then copy the .env.example file to .env:

```sh
cp .env.example .env
```

Then run the following command to start the server:

```sh
docker-compose up -d
```

These command starts the development server. Once the server is running, you can open your browser and navigate to the URL that the server is running on (usually http://localhost:5173 or similar). The application should load in your browser.