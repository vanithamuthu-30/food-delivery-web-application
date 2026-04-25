# food-delivery-web-application
Foody is a food delivery web application built with a React + Vite frontend and an Express + PostgreSQL backend.

<img width="2000" height="1125" alt="image" src="https://github.com/user-attachments/assets/c6332e66-0490-4aee-8893-20bb3dfb0a36" />

<img width="2000" height="947" alt="image" src="https://github.com/user-attachments/assets/78480302-ecda-4759-906c-435da74c19db" />

## Project Overview

- **Frontend**: React, Vite, React Router, Bootstrap, Axios
- **Backend**: Express.js, PostgreSQL, JWT authentication, bcrypt password hashing
- **Database**: PostgreSQL schema located in `frontend/database/schema.sql`

## Features

- User registration and login
- JWT-based authentication
- Product browsing and search
- Add to cart, update cart, remove items
- Place orders and view order history
- Favorites and support messaging
- User profile view and update

## Repository Structure

- `backend/` - Express API server and database integration
- `frontend/` - React application source code
- `frontend/database/schema.sql` - PostgreSQL database schema

## Prerequisites

- Node.js 18+ installed
- PostgreSQL installed and running
- `psql` CLI available for database initialization

## Setup

### 1. Backend

1. Open a terminal in `backend/`
2. Install dependencies:

```bash
cd backend
npm install
```

3. Create a `.env` file in `backend/` with values like:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=foody_db
DB_PASSWORD=1234
DB_PORT=5432
JWT_SECRET=your-secret-key
```

4. Initialize the database schema:

```bash
npm run init-db
```

5. Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000` by default.

### 2. Frontend

1. Open a terminal in `frontend/`
2. Install dependencies:

```bash
cd frontend
npm install
```

3. Start the frontend development server:

```bash
npm run dev
```

4. Open the provided Vite URL in your browser, usually `http://localhost:5173/`.

## Available Scripts

### Backend

- `npm start` - Start the server with Node
- `npm run dev` - Start the server with Nodemon
- `npm run init-db` - Initialize PostgreSQL schema using `schema.sql`

### Frontend

- `npm run dev` - Start Vite development server
- `npm run build` - Build production assets
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## Notes

- Update `frontend` API calls if the backend runs on a different host or port.
- Ensure PostgreSQL is running before starting the backend.
- The database schema is located at `frontend/database/schema.sql`.

## License

This repository does not include a license file. Add one if you want to publish the project publicly.

