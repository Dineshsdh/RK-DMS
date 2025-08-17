# RK DMS Backend API

A Node.js/Express backend API for the RK Sweet Shop Distribution Management System.

## Features

- Invoice management (CRUD operations)
- Sweet inventory management
- Search functionality
- Date-range filtering
- Pagination support
- MongoDB integration
- CORS enabled for frontend integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
```bash
# Create .env file
MONGODB_URL=mongodb://127.0.0.1:27017/rk_dms
PORT=5000
```

3. Seed the database with initial sweet data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

Or start the production server:
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Check server status

### Invoice Endpoints

#### Basic CRUD
- `GET /api/invoices` - Get all invoices (with pagination)
  - Query parameters: `page` (default: 1), `limit` (default: 10)
- `GET /api/invoices/:id` - Get invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

#### Search and Filter
- `GET /api/invoices/search/:query` - Search invoices by customer name, order number, or mobile
- `GET /api/invoices/date-range/:startDate/:endDate` - Get invoices by date range

### Sweet Endpoints

#### Basic CRUD
- `GET /api/sweets` - Get all sweets (sorted by name)
- `GET /api/sweets/:id` - Get sweet by ID
- `POST /api/sweets` - Create new sweet
- `PUT /api/sweets/:id` - Update sweet
- `DELETE /api/sweets/:id` - Delete sweet

#### Search
- `GET /api/sweets/search/:query` - Search sweets by name

## Data Models

### Invoice Model
```javascript
{
  customerName: String,
  mobileNo: String,
  orderNo: String,
  dateTime: String,
  employee: String,
  items: [{
    sweet: String,
    quantity: Number,
    rate: Number,
    total: Number
  }],
  advanceAmount: Number,
  discount: Number,
  discountAmount: Number,
  totalAmount: Number,
  grandTotal: Number,
  roundedGrandTotal: Number,
  deliveryDate: String,
  deliveryDay: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Sweet Model
```javascript
{
  name: String (required, unique),
  rate: Number (required)
}
```

## Error Handling

All endpoints return consistent error responses:
```javascript
{
  "error": "Error message description"
}
```

HTTP status codes used:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Development

### File Structure
```
├── server.js           # Main server file
├── db.js              # Database connection
├── invoice.model.js   # Invoice schema
├── sweet.model.js     # Sweet schema
├── invoice.routes.js  # Invoice route handlers
├── sweets.routes.js   # Sweet route handlers
├── sweets.seed.js     # Database seeding script
└── package.json       # Dependencies and scripts
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial sweet data

## CORS Configuration

The server is configured to accept requests from:
- `http://localhost:5173` (Vite development server)

To modify CORS settings, update the `cors` configuration in `server.js`.

## Database

The application uses MongoDB with Mongoose ODM. The database name is `rk_dms`.

Default connection: `mongodb://127.0.0.1:27017/rk_dms`

## Frontend Integration

This backend is designed to work with the React frontend located in the `../Front-end` directory. The frontend uses the API endpoints defined above for all data operations.