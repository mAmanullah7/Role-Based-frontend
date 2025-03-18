# Role-Based Access Control Frontend

A React-based frontend application for the Role-Based Access Control (RBAC) system. This application interacts with the RBAC API to provide a user-friendly interface for managing users, roles, and permissions.

## Features

- User authentication (login, register)
- User profile management
- Role-based access control
- Admin dashboard for user management
- Role management (create, edit, delete roles)
- Permission management
- Responsive design using Bootstrap

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running at https://role-based-backend-gamma.vercel.app

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Role-Based-Backend/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000.

## Usage

### Authentication

- **Login**: Use the login form to authenticate with your credentials.
- **Register**: Create a new account using the registration form.

### User Dashboard

- View your profile information
- See your assigned role and permissions
- Access features based on your role permissions

### Admin Features

Administrators have access to additional features:

- **User Management**: View all users and assign roles to users
- **Role Management**: Create, edit, and delete roles with specific permissions

## API Integration

This frontend application integrates with the Role-Based Access Control API at https://role-based-backend-gamma.vercel.app. The API provides the following endpoints:

- Authentication endpoints
- User management endpoints
- Role management endpoints

## Default Admin Credentials

For testing purposes, you can use the default admin account:

- Email: `admin@example.com`
- Password: `Admin@123`

## Technologies Used

- React
- React Router
- Axios for API requests
- React Bootstrap for UI components
- React Toastify for notifications
- Context API for state management 