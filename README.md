# Sales & Expense Management System

A comprehensive web application for managing sales and expense records with role-based access control, built with React, Node.js, Express, and MongoDB.

## Features

### User Roles
- **Admin**: Full control (add, edit, delete sales/expenses, view reports)
- **Manager**: Can only add entries (sales/expenses) and view totals

### Core Functionality
- **Dashboard**: Date-based summary showing total sales, expenses, and remaining balance
- **Sales Management**: Add, view, edit (admin only), and delete (admin only) sales records
- **Expense Management**: Add, view, edit (admin only), and delete (admin only) expense records
- **File Attachments**: Support for image and PDF uploads
- **Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

### Technical Features
- Real-time data updates
- Date filtering for records
- File upload with validation
- Secure API endpoints
- Role-based route protection

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Axios for API calls
- Heroicons for icons
- Headless UI components

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd sales-expense-manager
```

### 2. Install Dependencies

First, install the root dependencies:
```bash
npm install
```

Then install server dependencies:
```bash
cd server
npm install
cd ..
```

Finally, install client dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sales_expense_db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
```

### 4. Database Setup

Make sure MongoDB is running on your system. The application will automatically create the database and collections on first run.

### 5. Initial Setup (First Time Only)

Run the setup script to configure environment variables:
```bash
npm run setup
```

### 6. Start the Application

#### Development Mode (Both servers)
From the root directory:
```bash
npm run dev
```

This will start both the backend server (port 5000) and frontend development server (port 3000).

#### Individual Servers
```bash
# Start backend only
npm run server

# Start frontend only
npm run client
```

#### Quick Start (Windows)
```bash
start.bat
```

#### Quick Start (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default User Setup

Since this is a new installation, you'll need to register the first user:

1. Go to http://localhost:3000/register
2. Create an admin account with role "admin"
3. Create additional manager accounts as needed

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Sales
- `GET /api/sales` - Get all sales (with optional date filter)
- `POST /api/sales` - Create new sale
- `PUT /api/sales/:id` - Update sale (admin only)
- `DELETE /api/sales/:id` - Delete sale (admin only)

### Expenses
- `GET /api/expenses` - Get all expenses (with optional date filter)
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense (admin only)
- `DELETE /api/expenses/:id` - Delete expense (admin only)

### Dashboard
- `GET /api/dashboard/summary` - Get daily summary for selected date
- `GET /api/dashboard/monthly-summary` - Get monthly summary

## File Upload

The application supports file uploads for sales and expense records:
- Supported formats: JPG, JPEG, PNG, PDF
- Maximum file size: 5MB
- Files are stored in `server/uploads/` directory
- Files are accessible via `/uploads/:filename` endpoint

## Project Structure

```
sales-expense-manager/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── middleware/         # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── uploads/           # File upload directory
│   ├── index.js           # Server entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Usage Guide

### For Managers
1. **Login**: Use your credentials to access the system
2. **Dashboard**: View daily summaries by selecting dates
3. **Add Sales**: Navigate to "Add Sale" to record new sales
4. **Add Expenses**: Navigate to "Add Expense" to record new expenses
5. **View Records**: Browse sales and expense lists with date filtering

### For Admins
All manager features plus:
1. **Edit Records**: Modify existing sales and expense entries
2. **Delete Records**: Remove sales and expense entries
3. **User Management**: Register new users with appropriate roles

## Mobile Compatibility

The application is fully responsive and optimized for mobile devices:
- Touch-friendly interface
- Responsive navigation
- Mobile-optimized forms
- Adaptive layouts for different screen sizes

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- File upload restrictions
- CORS protection

## Development

### Adding New Features
1. Backend: Add routes in `server/routes/`
2. Frontend: Add components in `client/src/components/` or pages in `client/src/pages/`
3. Update navigation in `client/src/components/Layout.js`

### Database Models
- **User**: Authentication and role management
- **Sale**: Sales transaction records
- **Expense**: Expense transaction records

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in .env file

2. **Port Already in Use**
   - Change ports in package.json scripts
   - Kill existing processes using the ports

3. **File Upload Issues**
   - Check file size (max 5MB)
   - Verify file format (JPG, PNG, PDF only)
   - Ensure uploads directory exists and has write permissions

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in .env file
   - Verify token expiration

5. **Tailwind CSS Not Working**
   - Ensure Tailwind CSS v3 is properly installed
   - Check that `@tailwind` directives are in `client/src/index.css`
   - Verify PostCSS configuration includes `tailwindcss` and `autoprefixer`
   - Clear browser cache and restart development server

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository or contact the development team.