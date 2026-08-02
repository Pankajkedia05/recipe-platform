# Recipe Platform

A full-stack recipe sharing application with React frontend and Express/MongoDB backend.

## Project Structure

- `backend/` — Express API server
- `frontend/` — React app

## Prerequisites

- Node.js 18+ / npm
- MongoDB Atlas or local MongoDB instance

## Backend Setup

1. Open a terminal in `backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

## Frontend Setup

1. Open a terminal in `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file if needed:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the frontend:
   ```bash
   npm start
   ```

## Running Locally

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`

## Build

Generate a production build for the frontend:

```bash
cd frontend
npm run build
```

## Notes

- Keep `.env` files private and never commit secrets.
- If using MongoDB Atlas, ensure your IP is whitelisted and DNS is reachable.
