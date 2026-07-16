# Express MongoDB Server

A simple backend server built with **Node.js**, **Express.js**, and **MongoDB**.

## Features

* Express.js server setup
* MongoDB database connection
* Environment variables using dotenv
* POST API for adding data
* GET API for retrieving data
* CORS enabled
* JSON data handling

## Technologies Used

* Node.js
* Express.js
* MongoDB
* Dotenv
* CORS

## Installation

```bash
git clone <repository-url>
cd <project-folder>
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000

DB_USER=your_database_user
DB_PASS=your_database_password
```

## Run the Server

```bash
npm start
```

or

```bash
node index.js
```

## API Endpoints

### Get Data

```http
GET /
```

### Create Data

```http
POST /your-route
```

### Retrieve Data

```http
GET /your-route
```

## Project Structure

```bash
project-root/
│
├── node_modules/
├── .env
├── .gitignore
├── package.json
└── index.js
```

## Author

**Md. Asik**

## Status

🚀 Basic backend server setup completed.
