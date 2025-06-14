
# Standalone Research Funding Portal Code

This repository contains the full source code for the Research Funding Portal, 
separated into a Flask backend and a React frontend.

## Directory Structure

- `/backend`: Contains the Flask API application.
- `/frontend`: Contains the React (Vite) frontend application.
- `/database_schema.sql`: SQL script to set up the PostgreSQL database schema.

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+ (for frontend)
- PostgreSQL database server
- Git

### Backend Setup

1.  Navigate to the `backend` directory: `cd backend`
2.  Create a Python virtual environment: `python -m venv venv`
3.  Activate the virtual environment:
    *   macOS/Linux: `source venv/bin/activate`
    *   Windows: `venv\Scriptsctivate`
4.  Install dependencies: `pip install -r requirements.txt`
5.  Create a `.env` file by copying `.env.example` and configure your database URL and other settings.
    Example `.env` for local PostgreSQL:
    ```
    SECRET_KEY=your_very_secret_key
    FLASK_APP=run.py
    FLASK_ENV=development
    DATABASE_URL=postgresql://your_postgres_user:your_postgres_password@localhost:5432/funding_portal_db
    FRONTEND_URL=http://localhost:3000
    ```
6.  Initialize your PostgreSQL database and create the `funding_portal_db` database.
7.  Run the database migrations (the application creates tables on first run with `db.create_all()`):
    The application will attempt to create tables when it starts. Ensure your database user has permissions.
8.  (Optional) Populate with sample data by sending a POST request to `/api/_populate_sample_data` (e.g., using Postman or curl) after the server is running.
9.  Start the Flask development server: `flask run` or `python run.py`

    The backend API will be available at `http://localhost:5000`.

### Frontend Setup

1.  Navigate to the `frontend` directory: `cd frontend`
2.  Install dependencies: `npm install` (or `pnpm install` or `yarn install`)
3.  Create a `.env` file by copying `.env.example`.
    Ensure `REACT_APP_API_URL` points to your backend (e.g., `http://localhost:5000/api`).
    ```
    REACT_APP_API_URL=http://localhost:5000/api
    ```
4.  Start the React development server: `npm run dev` (or `pnpm dev` or `yarn dev`)

    The frontend application will be available at `http://localhost:3000`.

## Database Schema

Refer to `database_schema.sql` for the table definitions and relationships.
Execute this script against your PostgreSQL database to set up the necessary tables.

## Deployment

Refer to the comprehensive to-do list previously provided for detailed deployment instructions for various platforms (e.g., Docker, DigitalOcean, Vercel, Heroku).

Key steps generally involve:
-   **Backend**: Using a production server like Gunicorn, configuring Nginx as a reverse proxy, managing environment variables securely.
-   **Frontend**: Building static assets (`npm run build`) and serving them via a static file server or a platform like Vercel/Netlify.

## Contributing

(Add contribution guidelines if this were a public project)

## License

(Specify a license, e.g., MIT)
