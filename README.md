# Sweety – Blood Glucose Tracker

A full-stack web application for recording, managing, and analysing daily blood glucose readings. Sweety allows users to securely maintain their glucose history, view daily summaries, and monitor monthly trends through an intuitive dashboard.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Application Architecture](#application-architecture)
- [Project Structure](#project-structure)
- [Business Rules and Validation](#business-rules-and-validation)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Security](#security)
- [Future Improvements](#future-improvements)

---

## Project Overview

Sweety is designed to help individuals maintain a structured record of their blood glucose measurements.

Users can create an account, log in securely, add glucose readings, update or delete existing records, and generate reports for different time periods.

The application supports four daily measurement slots:

1. Morning (fasting)
2. After breakfast
3. After lunch
4. After dinner

Each user's readings are associated with their authenticated account, ensuring that users can only access and manage their own records.

## Key Features

### 1. Authentication and User Management
- User registration with name, email, and password.
- Secure password hashing using bcrypt.
- User login with email and password.
- JWT-based authentication.
- Protected routes for authenticated users.
- Individual user data isolation.

### 2. Glucose Reading Management
- Add new blood glucose readings.
- View reading history.
- Edit existing readings.
- Delete readings.
- Record measurements using four predefined daily time slots.
- Store glucose values in mg/dL.

### 3. Input Validation
- Accepts integer glucose values between 40 and 600 mg/dL.
- Prevents future dates.
- Validates date format and calendar validity.
- Restricts readings to the four supported time slots.
- Prevents duplicate readings for the same user, date, and time slot.
- Limits users to a maximum of four readings per day through the one-reading-per-slot rule.

### 4. Reports and Analytics

The application provides three report types:

| Report | Description |
|---|---|
| Daily Report | Displays readings and summary statistics for a selected date. |
| Month-to-Date | Summarises readings from the beginning of the current month through today. |
| Previous Month | Summarises readings for the complete previous calendar month. |

Reports include:

- Highest glucose reading.
- Lowest glucose reading.
- Average glucose reading, rounded to one decimal place.
- Total number of readings.
- Individual time-slot readings in the daily report.

### 5. Dashboard
- Centralised application dashboard.
- Reading management interface.
- Report and analytics interface.
- Visualisation of glucose data using Recharts.

---

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite |
| Styling | Bootstrap 5 |
| Routing | React Router |
| HTTP Client | Axios |
| Charts | Recharts |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL |
| Authentication | JSON Web Tokens (JWT) |
| Password Security | bcrypt |
| Validation | express-validator |
| Environment Configuration | dotenv |
| Version Control | Git and GitHub |

---

## Application Architecture

Sweety follows a client-server architecture.

```text
             React Frontend
             (Vite + Bootstrap)
                    |
                    | HTTP Requests
                    | Axios
                    v
             Express REST API
                    |
          +---------+----------+
          |                    |
     Authentication       Reading & Report
       Middleware           Controllers
          |                    |
          +---------+----------+
                    |
                 Services
                    |
                    v
              PostgreSQL
```

### Frontend
The React application provides the user interface and communicates with the backend through REST API endpoints.

Axios handles HTTP requests and attaches the JWT access token to authenticated requests.

### Backend
The Express application handles:
- Authentication and authorisation.
- Request validation.
- Reading CRUD operations.
- Report generation.
- Database interactions.

### Database
PostgreSQL stores user accounts and glucose readings. Database queries are scoped to the authenticated user's ID.

---

## Project Structure

```text
sweety_glucose_tracker/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   ├── context/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── readings/
│   │   │   └── reports/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── scripts/
│   │   └── seed.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Business Rules and Validation

The backend enforces the following rules:

| Rule | Requirement |
|---|---|
| Glucose value | Integer between 40 and 600 mg/dL |
| Reading date | Valid date in YYYY-MM-DD format |
| Future dates | Not permitted |
| Daily readings | Maximum four |
| Time slots | Four predefined slots |
| Duplicate readings | One reading per user, date, and slot |
| Authentication | Required for reading and report endpoints |
| Data isolation | Users can only access their own readings |

The database also enforces uniqueness for a user's date and time-slot combination.

---

## API Documentation

**Base URL**

```text
http://localhost:5000/api
```

All responses use JSON.

### Authentication Endpoints

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Not required |
| POST | `/auth/login` | Authenticate a user | Not required |

#### Register

**Request**

```json
{
  "name": "Demo User",
  "email": "demo@example.com",
  "password": "your_password"
}
```

**Success response:** `201 Created`

#### Login

**Request**

```json
{
  "email": "demo@example.com",
  "password": "your_password"
}
```

**Success response:** `200 OK`

Returns the authenticated user and JWT token.

### Reading Endpoints

All reading endpoints require a valid JWT access token.

Include the following header:

```text
Authorization: Bearer <JWT_TOKEN>
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/readings` | Retrieve the authenticated user's readings |
| POST | `/readings` | Create a glucose reading |
| GET | `/readings/:id` | Retrieve a reading by ID |
| PUT | `/readings/:id` | Update a reading |
| DELETE | `/readings/:id` | Delete a reading |

#### Create a Reading

**Request**

```json
{
  "reading_date": "2026-11-10",
  "time_slot": "morning",
  "glucose_value": 105
}
```

Supported time-slot values:

```text
morning
after_breakfast
after_lunch
after_dinner
```

**Success response:** `201 Created`

#### Update a Reading

**Method:** `PUT`

**Endpoint:** `/readings/:id`

Uses the same request fields as the create endpoint.

#### Delete a Reading

**Method:** `DELETE`

**Endpoint:** `/readings/:id`

### Report Endpoints

All report endpoints require authentication.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/reports/daily?date=YYYY-MM-DD` | Generate a daily report |
| GET | `/reports/month-to-date` | Generate the current month's report |
| GET | `/reports/previous-month` | Generate the previous month's report |

#### Daily Report Example

```text
GET /api/reports/daily?date=2026-11-10
```

The response contains the selected date, summary statistics, and individual readings.

#### Report Summary Example

```json
{
  "highest": 145,
  "lowest": 105,
  "average": 125.0,
  "total_readings": 4
}
```

*The values above are illustrative.*

---

## Database Design

The application uses PostgreSQL.

### Users

Stores registered user accounts.

| Column | Purpose |
|---|---|
| id | Unique user identifier |
| name | User's name |
| email | Unique email address |
| password | Bcrypt password hash |
| created_at | Account creation timestamp |

### Readings

Stores glucose measurements.

| Column | Purpose |
|---|---|
| id | Unique reading identifier |
| user_id | Reference to the owning user |
| reading_date | Date of measurement |
| time_slot | Measurement time slot |
| glucose_value | Glucose value in mg/dL |
| created_at | Record creation timestamp |
| updated_at | Last update timestamp |

### Database Constraints

- Unique user email.
- Unique combination of `user_id`, `reading_date`, and `time_slot`.
- User-specific reading ownership.
- Valid glucose values and supported time slots are enforced by backend validation.

---

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm.
- PostgreSQL.
- Git.

### 1. Clone the Repository

```bash
git clone https://github.com/Jerin34/sweety_glucose_tracker.git
```

```bash
cd sweety_glucose_tracker
```

### 2. Set Up the Database

Create a PostgreSQL database:

```sql
CREATE DATABASE sweety_db;
```

Ensure the database has the required `users` and `readings` tables, columns, and constraints described in the database design section.

### 3. Configure the Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example` as a reference.

Configure your PostgreSQL credentials and JWT secret.

### 4. Configure the Frontend

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using the client `.env.example`.

The frontend API URL should point to your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Environment Variables

### Backend – `server/.env`

```env
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweety_db
DB_USER=your_database_username
DB_PASSWORD=your_database_password

JWT_SECRET=replace_with_a_secure_secret

CLIENT_URL=http://localhost:5173
APP_TIME_ZONE=Asia/Kolkata

# Optional: used by the database seed script
SEED_EMAIL=demo@example.com
SEED_PASSWORD=your_demo_password
```

### Frontend – `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

**Important:** Never commit actual `.env` files, database passwords, or JWT secrets to GitHub. The example files contain placeholders only.

---

## Database Seeding

The project includes a seed script to create a demo user and sample glucose readings.

Configure the following variables in `server/.env`:

```env
SEED_EMAIL=demo@example.com
SEED_PASSWORD=your_demo_password
```

Run the seed script from the server directory:

```bash
node scripts/seed.js
```

The script creates or updates the configured demo account and inserts sample readings.

**Note:** The seed script uses a fixed sample date. Review the sample data in `server/scripts/seed.js` if you want to change the demo reporting date.

---

## Running the Application

Start the backend:

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

The Vite development server will display the frontend URL, normally:

```text
http://localhost:5173
```

You can check the backend status at:

```text
http://localhost:5000/
```

Expected response:

```json
{
  "success": true,
  "message": "Sweety API is running"
}
```

---

## Building for Production

To create a production frontend build:

```bash
cd client
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

To start the backend using its production start script:

```bash
cd server
npm start
```

Configure production environment variables, database connectivity, CORS origin, and HTTPS appropriately before deployment.

---

## Security

The application implements several security measures:

- Passwords are hashed using bcrypt before database storage.
- JWT tokens protect private API endpoints.
- Authentication middleware verifies tokens before allowing access.
- Reading queries are scoped to the authenticated user's ID.
- Parameterised SQL queries are used for database operations.
- Express Validator validates incoming request data.
- Database uniqueness constraints prevent duplicate daily time-slot readings.
- Environment variables keep configuration and secrets outside source code.

---

## Future Improvements

Potential enhancements include:

- Export reports as PDF or CSV.
- Add configurable glucose target ranges.
- Introduce email or reminder notifications.
- Add more detailed trend analysis.
- Support deployment with managed PostgreSQL.
- Add automated integration and end-to-end tests.

---

## Author

**Jerin Benny**

GitHub: [@Jerin34](https://github.com/Jerin34)

Project Repository: [Sweety – Blood Glucose Tracker](https://github.com/Jerin34/sweety_glucose_tracker)

---

*Sweety is a personal glucose tracking and reporting application. It is not a medical diagnostic tool and should not replace professional medical advice.*
