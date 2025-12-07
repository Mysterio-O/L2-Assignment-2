# Vehicle Rental Management System

A comprehensive backend API for managing vehicle rentals with user authentication, booking management, and automated rental status tracking.

## 🚀 Live URL

[Live Link](https://vehicle-rental-system-zeta.vercel.app)

---

## ✨ Features

### Authentication & Authorization
- **User Registration & Login** - Secure JWT-based authentication with bcrypt password hashing
- **Role-Based Access Control** - Separate permissions for Admin and Customer roles
- **Protected Routes** - Middleware-based route protection with role validation

### Vehicle Management
- **CRUD Operations** - Complete vehicle lifecycle management (Create, Read, Update, Delete)
- **Vehicle Types** - Support for cars, bikes, vans, and SUVs
- **Availability Tracking** - Real-time vehicle availability status (available/booked)
- **Rental Pricing** - Configurable daily rental rates per vehicle

### Booking System
- **Smart Booking Creation** - Automatic rental cost calculation based on rental duration
- **Status Management** - Track bookings through active, cancelled, and returned states
- **Date Validation** - Ensures rental end dates are after start dates
- **Role-Based Actions** - Customers can cancel, Admins can mark as returned

### Automated Systems
- **Auto-Return Service** - Cron job that automatically marks ended rentals as returned every 10 minutes
- **Vehicle Status Sync** - Automatically updates vehicle availability when bookings end
- **Constraint Protection** - Prevents deletion of users/vehicles with active bookings

### User Management
- **Profile Management** - Users can update their own profiles
- **Admin Controls** - Full user management capabilities for administrators
- **Self-Service** - Customers can manage their own account details

---

## 🛠️ Technology Stack

### Backend Framework
- **Node.js** - JavaScript runtime environment
- **Express.js** v5.2.1 - Web application framework
- **TypeScript** v5.9.3 - Type-safe development

### Database
- **PostgreSQL** - Relational database management
- **node-postgres (pg)** v8.16.3 - PostgreSQL client for Node.js

### Authentication & Security
- **JSON Web Tokens (jsonwebtoken)** v9.0.3 - Token-based authentication
- **bcryptjs** v3.0.3 - Password hashing and encryption

### Task Scheduling
- **node-cron** v4.2.1 - Automated background tasks for booking management

### Development Tools
- **tsx** v4.20.6 - TypeScript execution and watch mode
- **dotenv** v17.2.3 - Environment variable management

---

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn** package manager

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd assignment-02
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
CONNECTION_STRING=postgresql://username:password@localhost:5432/database_name
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_here
URL_V=/api/v1
```

**Environment Variables Explained:**
- `CONNECTION_STRING` - PostgreSQL database connection URL
- `PORT` - Server port number (default: 5000)
- `JWT_SECRET` - Secret key for JWT token generation (use a strong, random string)
- `URL_V` - API version prefix for all routes

### 4. Database Setup

The application automatically creates the required tables on startup:
- `users` - User accounts with authentication
- `vehicles` - Vehicle inventory
- `bookings` - Rental booking records

**Note:** Make sure your PostgreSQL database exists before running the application.

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or your configured PORT).

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "role": "customer"
}
```

#### Login
```http
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "customer"
    }
  }
}
```

### Vehicle Endpoints

#### Create Vehicle (Admin Only)
```http
POST /api/v1/vehicles
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-123",
  "daily_rent_price": 50.00,
  "availability_status": "available"
}
```

#### Get All Vehicles
```http
GET /api/v1/vehicles
```

#### Get Single Vehicle
```http
GET /api/v1/vehicles/:id
```

#### Update Vehicle (Admin Only)

 - All Fields are optional in the request body

```http
PUT /api/v1/vehicles/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

#### Delete Vehicle (Admin Only)
```http
DELETE /api/v1/vehicles/:id
Authorization: Bearer <admin_token>
```

### User Endpoints

#### Get All Users (Admin Only)
```http
GET /api/v1/users
Authorization: Bearer <admin_token>
```

#### Update User (Self or Admin)

 - All fields are optional in the request body

```http
PUT /api/v1/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

#### Delete User (Admin Only)
```http
DELETE /api/v1/users/:id
Authorization: Bearer <admin_token>
```

### Booking Endpoints

#### Create Booking (Customer or Admin)
```http
POST /api/v1/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-12-10",
  "rent_end_date": "2024-12-15"
}
```

#### Get Bookings
```http
GET /api/v1/bookings
Authorization: Bearer <token>
```
- **Customers** see only their bookings
- **Admins** see all bookings

#### Update Booking Status
```http
PUT /api/v1/bookings/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "cancelled"
}
```
- **Customers** can set status to `"cancelled"`
- **Admins** can set status to `"returned"`

---

## 🏗️ Project Structure

```
assignment-02/
├── src/
│   ├── config/
│   │   ├── index.ts           # Environment configuration
│   │   └── db.ts              # Database connection & initialization
│   ├── middleware/
│   │   ├── auth.ts            # JWT authentication middleware
│   │   └── allowSelfOrAdmin.ts # Authorization middleware
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.route.ts
│   │   ├── vehicles/
│   │   │   ├── vehicle.controller.ts
│   │   │   ├── vehicle.service.ts
│   │   │   └── vehicle.route.ts
│   │   ├── users/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   └── user.route.ts
│   │   └── bookings/
│   │       ├── booking.controller.ts
│   │       ├── booking.service.ts
│   │       ├── booking.route.ts
│   │       └── cron.service.ts
│   ├── helper/
│   │   ├── authHelper.ts      # Authentication validation helpers
│   │   ├── vehicleHelper.ts   # Vehicle validation helpers
│   │   └── bookingHelper.ts   # Booking validation & utilities
│   ├── types/
│   │   ├── app/
│   │   │   └── types.ts       # Application type definitions
│   │   └── express/
│   │       └── index.d.ts     # Express type extensions
│   └── server.ts              # Application entry point
├── .env                       # Environment variables
├── .gitignore                 
├── package-lock.json
├── package.json
├── tsconfig.json
├── vercel.json
└── readme.md
```

---

## 🔐 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
);
```

### Vehicles Table
```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
  availability_status VARCHAR(30) NOT NULL CHECK (availability_status IN ('available', 'booked'))
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
  CHECK (rent_end_date > rent_start_date)
);
```

---

## 🎯 Usage Examples

### Complete Rental Flow

1. **Register as a customer**
2. **Login to receive JWT token**
3. **Browse available vehicles** (GET /api/v1/vehicles)
4. **Create a booking** for desired dates
5. **View your bookings** (GET /api/v1/bookings)
6. **Cancel booking** if needed (before rental starts)
7. **Admin marks as returned** when vehicle is returned

### Admin Workflow

1. **Login with admin credentials**
2. **Add new vehicles** to inventory
3. **View all bookings** across system
4. **Mark rentals as returned**
5. **Manage users** and vehicle inventory
6. **System auto-returns** ended bookings every 10 minutes

---

## 🔒 Security Features

- **Password Hashing** - bcrypt with salt rounds of 12
- **JWT Authentication** - Secure token-based auth with 7-day expiration
- **Role-Based Access** - Granular permissions for different user types
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Parameterized queries via pg library
- **Email Validation** - Regex-based email format checking
- **Cascade Protection** - Prevents deletion with active relationships

---

## 📝 Notes

- The automated cron job runs every 10 minutes to process ended rentals
- Booking total price is automatically calculated based on rental duration and vehicle daily rate
- Users cannot be deleted if they have active bookings
- Vehicles cannot be deleted if they have active bookings
- Customers can only cancel bookings before the rental start date
- JWT tokens expire after 7 days

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Mysterio**

---

## 📧 Support

For support, email [skrabbi.019@gmail.com] or open an issue in the repository.