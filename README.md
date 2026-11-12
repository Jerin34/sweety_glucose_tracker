
# Sweety – Blood Glucose Tracker

Sweety is a full-stack blood glucose tracking application that allows users to record, manage, and monitor their daily glucose readings. It provides personalized reports and visual summaries to help users understand their glucose trends.

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- User-specific data isolation

### Glucose Reading Management
- Create, view, update, and delete glucose readings
- Record readings across four daily time slots:
  - Morning (Fasting)
  - After Breakfast
  - After Lunch
  - After Dinner
- Glucose value validation (40–600 mg/dL)
- Maximum of four readings per day
- Prevent duplicate readings for the same date and time slot
- Prevent future-dated readings

### Reports and Analytics
- Daily glucose report
- Month-to-date report
- Previous month report
- Highest glucose value
- Lowest glucose value
- Average glucose value
- Total number of readings
- Daily reading breakdown
- Dashboard with visual glucose trends

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Bootstrap
- Axios
- Recharts

**Backend**
- Node.js
- Express.js
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt
- express-validator

## Project Structure

```text
sweety_glucose_tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── Scripts/
│   │   └── seed.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Jerin34/sweety_glucose_tracker.git

cd sweety_glucose_tracker
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE sweety_db;
```

Connect to the `sweety_db` database and create the tables:

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    reading_date DATE NOT NULL,
    time_slot VARCHAR(30) NOT NULL,
    glucose_value INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT valid_glucose
        CHECK (glucose_value BETWEEN 40 AND 600),

    CONSTRAINT valid_time_slot
        CHECK (
            time_slot IN (
                'morning',
                'after_breakfast',
                'after_lunch',
                'after_dinner'
            )
        ),

    CONSTRAINT unique_daily_slot
        UNIQUE (user_id, reading_date, time_slot)
);

CREATE INDEX idx_readings_user_date
ON readings(user_id, reading_date);
```

### 3. Backend Setup

Open a terminal:

```bash
cd server
npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure your PostgreSQL credentials and JWT secret:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweety_db
DB_USER=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=your_secure_jwt_secret

CLIENT_URL=http://localhost:5173
APP_TIME_ZONE=Asia/Kolkata

SEED_EMAIL=demo@example.com
SEED_PASSWORD=your_demo_password
```

Start the backend:

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 4. Frontend Setup

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file using `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open:

`http://localhost:5173`

## Database Seeding

To insert demo user and sample glucose readings, configure `SEED_EMAIL` and `SEED_PASSWORD` in `server/.env`.

Run the seed script from the server directory:

```bash
node Scripts/seed.js
```

The script creates or updates the demo user and inserts sample readings without duplicating existing readings for the same date and time slot.

## API Endpoints

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate a user |

### Glucose Readings

All reading endpoints require a valid JWT.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/readings` | Retrieve all user readings |
| POST | `/readings` | Create a reading |
| GET | `/readings/:id` | Retrieve a specific reading |
| PUT | `/readings/:id` | Update a reading |
| DELETE | `/readings/:id` | Delete a reading |

### Reports

All report endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/daily?date=YYYY-MM-DD` | Retrieve daily report |
| GET | `/reports/month-to-date` | Retrieve current month report |
| GET | `/reports/previous-month` | Retrieve previous month report |

For protected endpoints, include the JWT in the request header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Validation and Data Integrity

- Glucose values must be integers between 40 and 600 mg/dL.
- Only four predefined time slots are accepted.
- A user can have only one reading per time slot per day.
- Future dates are not accepted.
- Database constraints enforce valid values and prevent duplicate readings.
- Users can access only their own glucose readings and reports.

## Production Build

To generate the frontend production build:

```bash
cd client
npm run build
```

The generated production files are available in `client/dist`.

## Security

- Passwords are hashed using bcrypt.
- JWT authentication protects private routes.
- SQL queries use parameterized inputs.
- User-specific database queries enforce data isolation.
- Environment files containing credentials are excluded from version control.

## Author

**Jerin Benny**

GitHub: https://github.com/Jerin34
