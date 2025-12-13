# Stevens Fabrication Laboratory Website

**Group Name:** group Name

**Team Members:**

- Pratyush Patel - 20010352
- Jasmine Cairns - 10458274
- David Amin - 20013543

## Project Overview

The Stevens Fabrication Laboratory in Morton currently lacks a dedicated website and relies on an out-of-pocket Wix setup with limited functionality. This creates inefficiencies in daily operations - pricing must be calculated manually for every request, and equipment checkouts are tracked through a separate third-party system.

This project delivers a fully functional web platform for the Fab Lab that includes:

- **Automated price calculator** with cart system for order creation
- **User authentication** allowing students to log in and submit orders
- **Equipment checkout management** system with staff approval workflow
- **Staff dashboard** to manage inventory, pricing, orders, and checkouts
- **Background email notifications** for order confirmations

By building this system from the ground up, we aim to create a modern, student- and staff-friendly interface that improves efficiency, enhances communication, and supports the lab's growing demand for digital accessibility.

## Technology Stack

### Course Technologies

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Frontend framework + API routes for server-side rendering and client-side navigation |
| **Firebase** | User authentication (email/password) + file storage for design uploads |
| **Redis** | Caching layer for services, equipment lists, and user sessions |

### Independent Technologies

| Technology | Purpose |
|------------|---------|
| **RabbitMQ** | Message queue for asynchronous background tasks (order confirmation emails) |
| **Sharp** | Image processing library (Node.js wrapper for ImageMagick) to optimize and resize equipment images |
| **MongoDB** | Primary database for users, services, orders, equipment, and checkouts |

### Additional Technologies

- **Express.js** - Backend REST API server
- **Nodemailer** - Email delivery via Mailtrap (development) or SMTP (production)
- **Tailwind CSS** - Utility-first styling framework

## Project Structure

```text
Stevens-Fabrication-Laboratory-Website/
├── client/                      # Next.js frontend
│   ├── src/
│   │   ├── app/                # App router pages
│   │   │   ├── page.jsx        # Home page
│   │   │   ├── services/       # Services info
│   │   │   ├── equipment/      # Equipment browse
│   │   │   ├── order/          # Order creation
│   │   │   ├── dashboard/      # Student dashboard
│   │   │   ├── staff/          # Staff-only pages
│   │   │   └── login/          # Login page
│   │   ├── components/         # Reusable React components
│   │   ├── contexts/           # Auth context provider
│   │   └── lib/                # Firebase client config
│   ├── .env.local              # Frontend environment variables
│   └── package.json
│
├── backend/                     # Express.js API server
│   ├── config/                 # Database connections
│   ├── data/                   # Data access layer
│   ├── middleware/             # Auth middleware
│   ├── routes/                 # API endpoints
│   ├── queue/                  # RabbitMQ publisher
│   ├── worker/                 # Email worker (separate process)
│   ├── utils/                  # Image processing utilities
│   ├── scripts/                # Seed data, image processing
│   ├── .env                    # Backend environment variables
│   ├── server.js               # Main entry point
│   └── package.json
│
└── README.md                    # This file
```

## Prerequisites

Before running the application, install these services:

- **Node.js** v18+
- **MongoDB** (database)
- **Redis** (caching)
- **RabbitMQ** (message queue)

### macOS Installation

```bash
# Install via Homebrew
brew install mongodb-community redis rabbitmq

# Start services
brew services start mongodb-community
brew services start redis
brew services start rabbitmq
```

### Linux (Ubuntu/Debian)

```bash
# Install packages
sudo apt-get install mongodb redis-server rabbitmq-server

# Start services
sudo systemctl start mongodb
sudo systemctl start redis
sudo systemctl start rabbitmq-server
```

### Docker Alternative

```bash
# MongoDB
docker run -d -p 27017:27017 --name fablab-mongo mongo:latest

# Redis
docker run -d -p 6379:6379 --name fablab-redis redis:latest

# RabbitMQ
docker run -d -p 5672:5672 -p 15672:15672 --name fablab-rabbitmq rabbitmq:3-management
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/patelpratyush/Stevens-Fabrication-Laboratory-Website.git
cd Stevens-Fabrication-Laboratory-Website
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# - MongoDB connection string
# - Redis URL
# - RabbitMQ URL
# - Mailtrap credentials (sign up at https://mailtrap.io)
# - Firebase Admin SDK service account key

# Seed the database with sample data
npm run seed

# Start the backend server
npm start
```

Backend will run on `http://localhost:3001`

### 3. Email Worker Setup

In a **separate terminal**:

```bash
cd backend

# Start the email worker (listens for order notifications)
npm run worker
```

The worker processes messages from the `orders.created` RabbitMQ queue and sends emails via Mailtrap.

### 4. Frontend Setup

In a **separate terminal**:

```bash
cd client

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your Firebase client credentials
# Get these from: Firebase Console → Project Settings → General

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### 5. Firebase Configuration

#### Client-side (Frontend)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `stevens-fabrication-laboratory`
3. Go to **Project Settings → General**
4. Copy the Firebase config values
5. Paste into `client/.env.local`:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
   ```

#### Server-side (Backend)

1. Go to **Project Settings → Service Accounts**
2. Click **Generate New Private Key**
3. Save as `backend/serviceAccountKey.json`
4. This file is in `.gitignore` - **never commit it!**

### 6. Mailtrap Setup (Email Testing)

1. Sign up at [mailtrap.io](https://mailtrap.io/) (free)
2. Create a new inbox
3. Go to inbox settings and copy SMTP credentials
4. Update `backend/.env`:

   ```env
   MAILTRAP_USER=your_username
   MAILTRAP_PASS=your_password
   ```

## Running the Application

You need **3 terminals** running simultaneously:

```bash
# Terminal 1: Backend API
cd backend && npm start

# Terminal 2: Email Worker
cd backend && npm run worker

# Terminal 3: Frontend
cd client && npm run dev
```

Then open <http://localhost:3000> in your browser.

## API Endpoints

### Public / Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/services` | List all active services/materials |
| `GET` | `/api/equipment` | List all available equipment |
| `GET` | `/api/orders/me` | Get current user's orders (auth required) |
| `POST` | `/api/orders` | Create new order (auth required) |
| `GET` | `/api/checkouts/me` | Get current user's checkouts (auth required) |

### Staff-Only Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | Get all orders |
| `PATCH` | `/api/orders/:id` | Update order status |
| `GET` | `/api/checkouts` | Get all checkouts |
| `POST` | `/api/checkouts` | Create equipment checkout |
| `PATCH` | `/api/checkouts/:id` | Update checkout (extend, return) |
| `POST` | `/api/services` | Create new service/material |
| `PATCH` | `/api/services/:id` | Update service/material |
| `PATCH` | `/api/equipment/:id` | Update equipment status |

All authenticated endpoints require a Firebase JWT token in the `Authorization` header:

```http
Authorization: Bearer <firebase-id-token>
```

## User Roles

### Student

- Browse services and equipment
- Create orders with file uploads
- Request equipment checkouts
- View their own orders and checkouts
- Receive email confirmations

### Staff

- All student permissions
- Manage service catalog (add/edit pricing)
- Manage equipment inventory
- Approve/deny checkout requests
- View all orders and update statuses
- Receive email notifications for new orders

Role assignment is controlled by the backend (`backend/routes/auth.js`) based on email address.

## Key Features

### 1. Order System

- Students select services/materials from catalog
- Upload design files (PDF, STL, etc.) to Firebase Storage
- Backend calculates total price automatically
- Order saved to MongoDB with status tracking
- RabbitMQ enqueues order for background email processing

### 2. Equipment Checkout

- Students browse available equipment
- Request checkout with due date
- Staff approve or deny requests
- Equipment status automatically updates
- Track active checkouts and returns

### 3. Background Email System

When a new order is created:

1. Backend saves order to MongoDB
2. Publishes message to RabbitMQ `orders.created` queue
3. Worker picks up message
4. Sends 2 emails via Mailtrap:
   - **Student confirmation** (order details, total, files)
   - **Staff notification** (customer info, items, links)

### 4. Image Processing

Equipment images are automatically optimized:

```bash
npm run process-images
```

- Creates web-optimized versions (max 1200px)
- Generates thumbnails (300x300px)
- Updates MongoDB with image paths

## Testing the Email Flow

1. Ensure backend + worker are running
2. Create an order through the frontend or API
3. Check worker terminal - you should see:

   ```text
   Processing order FAB-251213-1430-A7B2...
   ✓ Confirmation sent to student@stevens.edu
   ✓ Staff notification sent
   ```

4. Open your Mailtrap inbox - 2 emails should appear

## Project Demonstration

For class presentation/grading:

1. **Start all services** (backend, worker, frontend)
2. **Student workflow:**
   - Sign up with `@stevens.edu` email
   - Browse services
   - Create order with file upload
   - View order in dashboard
3. **Show Mailtrap inbox** with confirmation emails
4. **Staff workflow:**
   - Login as staff (configured email)
   - View all orders in staff dashboard
   - Update order status
   - Manage equipment checkouts
5. **Show RabbitMQ management UI** (<http://localhost:15672>)
   - Queue activity
   - Message flow
6. **Demonstrate image processing:**

   ```bash
   npm run process-images
   ```

   - Show generated thumbnails

## Technologies Demonstrated

✅ **Next.js** - Server-side rendering, API routes, client routing
✅ **MongoDB** - Document database for all app data
✅ **Firebase** - Authentication + file storage
✅ **Redis** - Caching (services, sessions)
✅ **RabbitMQ** - Async message queue for emails
✅ **Sharp (ImageMagick)** - Image optimization and thumbnail generation

## Additional Documentation

- **Backend Setup Guide**: `backend/SETUP.md` - Detailed backend configuration
- **API Documentation**: See API Endpoints section above
- **Queue Message Format**: See `backend/SETUP.md` for RabbitMQ message schema

## Troubleshooting

### Backend won't start

```bash
# Check services are running
brew services list  # macOS
sudo systemctl status mongodb redis rabbitmq-server  # Linux
```

### Worker not receiving messages

- Verify RabbitMQ is running: `brew services list`
- Check RabbitMQ management UI: <http://localhost:15672> (guest/guest)
- Look for `orders.created` queue

### Emails not sending

- Verify Mailtrap credentials in `backend/.env`
- Check worker terminal for errors
- Confirm worker is running (`npm run worker`)

### Frontend can't reach backend

- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `client/.env.local`
- Verify CORS is enabled in `backend/server.js`

## Repository

**GitHub**: <https://github.com/patelpratyush/Stevens-Fabrication-Laboratory-Website>

## License

This project is created for educational purposes as part of coursework at Stevens Institute of Technology.
