# RK Sweet Shop Distribution Management System (DMS)

A complete web-based distribution management system for RK Sweet Shop, featuring invoice generation, sweet inventory management, and customer order tracking.

## Project Structure

```
├── Back-end/           # Node.js/Express API server
│   ├── server.js       # Main server file
│   ├── db.js          # Database connection
│   ├── *.model.js     # Mongoose data models
│   ├── *.routes.js    # API route handlers
│   └── package.json   # Backend dependencies
├── Front-end/          # React frontend application
│   ├── src/           # React source files
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
└── README.md          # This file
```

## Features

### Backend Features
- **Invoice Management**: Full CRUD operations for invoices
- **Sweet Inventory**: Manage sweet items with rates
- **Search & Filter**: Search invoices by customer, order number, or mobile
- **Date Range Queries**: Filter invoices by date range
- **Pagination**: Efficient data loading with pagination
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Consistent error responses
- **CORS Configuration**: Properly configured for frontend integration

### Frontend Features
- **User Authentication**: Login system for admin access
- **Invoice Creation**: Interactive bill creation with sweet selection
- **PDF Generation**: Generate printable invoices
- **Dashboard**: View and manage all invoices
- **Real-time Updates**: Dynamic calculations and validations
- **Responsive Design**: Modern, mobile-friendly UI

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd rk-dms
```

### 2. Backend Setup

```bash
cd Back-end
npm install
```

#### Environment Variables (Optional)
Create a `.env` file in the `Back-end` directory:
```bash
MONGODB_URL=mongodb://127.0.0.1:27017/rk_dms
PORT=5000
```

#### Start MongoDB
Ensure MongoDB is running on your system:
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Windows
net start MongoDB

# Or run manually
mongod --dbpath /path/to/your/data/directory
```

#### Seed Database
```bash
npm run seed
```

#### Start Backend Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

The backend will be available at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd Front-end
npm install
```

#### Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Documentation

### Base URL
`http://localhost:5000/api`

### Health Check
- `GET /health` - Check server status

### Invoice Endpoints
- `GET /invoices` - Get paginated invoices
- `GET /invoices/:id` - Get specific invoice
- `POST /invoices` - Create new invoice
- `PUT /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice
- `GET /invoices/search/:query` - Search invoices
- `GET /invoices/date-range/:start/:end` - Filter by date range

### Sweet Endpoints
- `GET /sweets` - Get all sweets
- `GET /sweets/:id` - Get specific sweet
- `POST /sweets` - Create new sweet
- `PUT /sweets/:id` - Update sweet
- `DELETE /sweets/:id` - Delete sweet
- `GET /sweets/search/:query` - Search sweets

### Request/Response Examples

#### Create Invoice
```bash
POST /api/invoices
Content-Type: application/json

{
  "customerName": "John Doe",
  "mobileNo": "9876543210",
  "orderNo": "ORD001",
  "dateTime": "2024-01-15T10:30:00",
  "employee": "Ramesh",
  "items": [
    {
      "sweet": "Milk Palkhova",
      "quantity": 2,
      "rate": 320,
      "total": 640
    }
  ],
  "advanceAmount": 100,
  "discount": 50,
  "deliveryDate": "2024-01-16",
  "deliveryDay": "Tuesday"
}
```

#### Create Sweet
```bash
POST /api/sweets
Content-Type: application/json

{
  "name": "Chocolate Burfi",
  "rate": 350
}
```

## Usage

### 1. Start the Application
1. Start MongoDB service
2. Start the backend server (`npm run dev` in Back-end/)
3. Start the frontend server (`npm run dev` in Front-end/)
4. Open `http://localhost:5173` in your browser

### 2. Login
Use the login page to access the admin dashboard.

### 3. Create Bills
- Click "Create Bill" from the dashboard
- Fill in customer details
- Select sweets from the dropdown (rates auto-populate)
- Add quantities for each sweet
- Set advance amount and discount if needed
- Choose delivery date
- Click "Generate PDF" to save and create invoice

### 4. Manage Invoices
- View all invoices in the dashboard
- Search and filter invoices
- Access invoice details

## Development

### Backend Development
- Routes are organized in separate files (`*.routes.js`)
- Models use Mongoose schemas (`*.model.js`)
- Database connection is centralized in `db.js`
- Error handling middleware is implemented
- Input validation is performed on all endpoints

### Frontend Development
- Built with React and Vite
- Uses Bootstrap for styling
- API calls are centralized in `api.js`
- Components are modular and reusable
- State management with React hooks

### Code Structure

#### Backend Files
- `server.js` - Express server setup and middleware
- `db.js` - MongoDB connection configuration
- `invoice.model.js` - Invoice data schema
- `sweet.model.js` - Sweet data schema
- `invoice.routes.js` - Invoice API endpoints
- `sweets.routes.js` - Sweet API endpoints
- `sweets.seed.js` - Database seeding script

#### Frontend Files
- `App.jsx` - Main application component
- `Login.jsx` - Authentication component
- `AdminDashboard.jsx` - Dashboard with invoice list
- `CreateBill.jsx` - Invoice creation form
- `Invoice.jsx` - Invoice display/PDF component
- `api.js` - Backend API integration

## Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
MongoDB connection error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running on your system.

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Stop other processes using port 5000 or change the PORT in environment variables.

#### CORS Error
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**Solution**: The backend is configured for `localhost:5173`. If using a different port, update the CORS configuration in `server.js`.

#### Sweets Not Loading
**Solution**: Run `npm run seed` in the backend directory to populate initial sweet data.

## Production Deployment

### Backend Deployment
1. Set environment variables for production MongoDB URL
2. Use `npm start` instead of `npm run dev`
3. Configure reverse proxy (nginx) for API endpoints
4. Set up SSL certificates

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve the `dist` folder with a web server
3. Update API base URL for production backend

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software for RK Sweet Shop.

## Support

For support or questions, please contact the development team.

---

**Note**: This system requires MongoDB to be running for full functionality. Ensure your MongoDB service is active before starting the application.