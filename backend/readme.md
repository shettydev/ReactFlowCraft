# ReactFlowCraft Backend

ReactFlowCraft is a project aimed at creating a user-friendly interface for designing and visualizing email marketing sequences as flowcharts. This README provides an overview of the backend part of the project.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The ReactFlowCraft backend is responsible for handling user authentication, managing email sequences, storing graphs representing the email sequences, and executing workflows defined in the graphs.

## Features

- User authentication using Passport.js with local strategy and JWT authentication
- CRUD operations for managing email sequences
- CRUD operations for managing graphs representing email sequences
- Execution of workflows defined in graphs, including sending emails
- Secure storage of user data and email sequences in MongoDB
- Error handling and validation for API requests

## Installation

1. Clone the repository:

```bash
git clone https://github.com/prathikshetty14/ReactFlowCraft/
```

2. Navigate to the project directory:

```bash
cd backend
```

3. Install dependencies:

```bash
bun install
```

4. Set up environment variables:

Create a `.env` file in the root directory and add the following environment variables:

```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Replace `your_mongodb_connection_string` with your MongoDB connection string and `your_jwt_secret` with a secret key for JWT authentication.

5. Start the server:

```bash
bun run start
```

The server will run on port 8000 by default. You can change the port in the `.env` file if needed.

## Usage

Once the server is running, you can use it to handle user authentication, manage email sequences, and execute workflows defined in graphs. See the [API Endpoints](#api-endpoints) section for details on available endpoints and their usage.

## API Endpoints

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.
- `GET /api/auth/logout`: Log out the current user.
- `POST /api/graphs`: Create a new graph representing an email sequence.
- `GET /api/graphs`: Get all graphs for the current user.
- `GET /api/graphs/:id`: Get a specific graph by ID.
- `PATCH /api/graphs/:id`: Update a graph by ID.
- `DELETE /api/graphs/:id`: Delete a graph by ID.
- `POST /api/workflows/execute/:id`: Execute the workflow defined in a graph by ID.

## Contributing

Contributions to ReactFlowCraft are welcome! If you'd like to contribute, please fork the repository, make your changes, and submit a pull request.

## Author

Prathik Shetty