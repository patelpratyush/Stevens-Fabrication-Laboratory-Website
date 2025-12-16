# Stevens Fabrication Laboratory Website

Web application for the Stevens Fab Lab to manage service orders, equipment checkouts, and pricing. Replaces their current manual processes and third-party systems with an integrated platform.

## Team Members
- Pratyush Patel - 20010352
- Jasmine Cairns - 10458274
- David Amin - 20013543

## 📦 What's Included in This Submission

This submission includes:
- ✅ Complete source code (frontend + backend)
- ✅ `.env` files pre-configured (backend/.env.local and client/.env.local)
- ✅ Firebase service account key (backend/config/serviceAccountKey.json)
- ✅ Seed script (backend/scripts/seed.js) with comprehensive test data
- ✅ All dependencies listed in package.json files
- ✅ This README with complete setup and testing instructions

## Prerequisites

You must have the following installed on your system:
- **Node.js v18+** (v25.2.1 recommended)
- **MongoDB** (community edition)
- **Redis** (latest version)
- **RabbitMQ** (latest version)
- **ImageMagick** (optional, for image processing - will fall back to Sharp if not available)

### Installing Prerequisites

**Mac (using Homebrew):**
```bash
brew install mongodb-community redis rabbitmq imagemagick
brew services start mongodb-community
brew services start redis
brew services start rabbitmq
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install mongodb redis-server rabbitmq-server imagemagick
sudo systemctl start mongodb
sudo systemctl start redis
sudo systemctl start rabbitmq-server
```

### Verify Services are Running

```bash
# Check MongoDB (should return connection info)
mongosh --eval "db.version()"

# Check Redis (should return PONG)
redis-cli ping

# Check RabbitMQ (should show status)
sudo rabbitmqctl status

# Check ImageMagick (optional)
convert -version
```

## Installation & Setup

### Step 1: Extract and Navigate to Project

```bash
unzip Stevens-Fabrication-Laboratory-Website.zip
cd Stevens-Fabrication-Laboratory-Website
```

### Step 2: Install Dependencies

Install root dependencies (for concurrently):
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
cd ..
```

Install client dependencies:
```bash
cd client
npm install
cd ..
```

### Step 3: Environment Configuration

**IMPORTANT:** The `.env` files are already included in this submission with working credentials.

- `backend/.env.local` - Backend environment variables (MongoDB, Redis, RabbitMQ, Mailtrap)
- `client/.env.local` - Frontend environment variables (Firebase configuration)
- `backend/config/serviceAccountKey.json` - Firebase Admin SDK credentials

**No additional configuration is needed!** The files are pre-configured and ready to use.

### Step 4: Seed the Database

Populate the database with test data (users, services, equipment, orders, checkouts):

```bash
cd backend
npm run seed
```

This will create:
- 4 test users (1 staff, 3 students)
- 7 services (3D printing, laser cutting, PCB fabrication, etc.)
- 7 equipment items (available, checked out, maintenance states)
- 4 sample orders (submitted, in-progress, completed statuses)
- 5 checkout requests (pending, approved, denied, returned statuses)

**Expected Output:**
```
🌱 Starting database seed...
✓ Cleared existing data
✓ Seeding users...
  Created 4 users
✓ Seeding services...
  Created 7 services
✓ Seeding equipment...
  Created 7 equipment items
✓ Seeding orders...
  Created 4 orders
✓ Seeding checkouts...
  Created 5 checkouts
✓ Seed completed successfully!
```

## Running the Application

### Option 1: Using Concurrently (Recommended - One Command)

From the root directory:
```bash
npm start
```

This command runs all three components simultaneously:
- Backend API server (port 3001)
- Email worker (background process)
- Frontend Next.js app (port 3000)

**Expected Output:**
```
[0] ✓ MongoDB connected
[0] ✓ Redis connected
[0] ✓ RabbitMQ connected
[0] ✓ Server running on http://localhost:3001
[1] ✓ Email worker connected to RabbitMQ
[1] Waiting for orders on queue: orders.created...
[2] ▲ Next.js 16.0.10 (Turbopack)
[2] - Local: http://localhost:3000
```

### Option 2: Using Separate Terminals

**Terminal 1 - Backend API:**
```bash
cd backend
npm start
```

**Terminal 2 - Email Worker:**
```bash
cd backend
npm run worker
```

**Terminal 3 - Frontend:**
```bash
cd client
npm run dev
```

### Accessing the Application

Once all services are running, open your browser and navigate to:

**http://localhost:3000**

## System Architecture

The system has two main components:

**Client** - Next.js React application providing the user interface (port 3000)
**Backend** - Express.js API server interfacing with MongoDB, Redis, RabbitMQ, and Firebase (port 3001)

## Course Technologies

**Next.js**
Frontend framework for building the single-page application with server-side rendering capabilities.

**Firebase**
Handles user authentication (email/password) and stores uploaded design files (STL, PDF, etc.).

**Redis**
Caches frequently accessed data (services and equipment lists) to improve API response times.

## Independent Technologies

**MongoDB**
Primary database storing users, services, orders, equipment, and checkout records.

**RabbitMQ**
Message queue system that handles background email processing. When orders are created, messages are queued and processed by a separate worker process to send confirmation emails without blocking the API.

**ImageMagick**
Command-line tool for image processing. Optimizes equipment photos and generates thumbnails. Falls back to Sharp (Node.js library) if ImageMagick is not installed.

## Test Users & Login Credentials

### Creating Test Users in Firebase

Before testing, create these users in Firebase Authentication:

1. Go to [Firebase Console](https://console.firebase.google.com/project/stevens-fabrication-laboratory/authentication/users)
2. Click "Add User"
3. Create these 2 users:

**Staff Account:**
- Email: `staff@stevens.edu`
- Password: `password123`

**Student Account:**
- Email: `student@stevens.edu`
- Password: `password123`

## Testing Guide

### 1. Testing Order Flow

**As a Student:**
1. Log in with `student@stevens.edu`
2. Navigate to "Services" page
3. Click on a service (e.g., "PLA 3D Print")
4. Enter quantity (e.g., 100 grams)
5. Add notes (optional)
6. Click "Submit Order"
7. You should see order confirmation with order number (e.g., FAB-241213-1430-A7B2)
8. Navigate to "My Orders" to see your order with status "submitted"

**As Staff:**
1. Log in with `staff@stevens.edu`
2. Navigate to "Orders" page
3. You should see all pending orders including the one you just created
4. Click on an order to view details
5. Update status to "in-progress"
6. Work on the order...
7. Update status to "ready" when complete
8. Student will see updated status in their "My Orders" page

**Testing Email Notifications:**
- When an order is created, check the Mailtrap inbox at https://mailtrap.io
- You should see a confirmation email sent to the staff email address

### 2. Testing Equipment Checkout Flow

**As a Student:**
1. Log in with `student@stevens.edu`
2. Navigate to "Equipment" page
3. Find an available piece of equipment (green badge)
4. Click "Request Checkout"
5. Select a due date
6. Add notes explaining why you need it
7. Submit the request
8. Navigate to "My Checkouts" to see status "pending"

**As Staff:**
1. Log in with `staff@stevens.edu`
2. Navigate to "Checkouts" page
3. View pending checkout requests
4. Click "Approve" or "Deny" with reason
5. If approved:
   - Equipment status changes to "checked_out"
   - Student can see "approved" status
   - Equipment no longer available for others
6. When student returns equipment:
   - Click "Mark as Returned"
   - Equipment status changes back to "available"

### 3. Testing Equipment Management

**As Staff:**
1. Log in with `staff@stevens.edu`
2. Navigate to "Equipment" page
3. Click "Add Equipment"
4. Fill in details:
   - Name: Test Equipment
   - Category: 3D Printing
   - Location: Fab Lab - Station 1
   - Status: Available
   - Requires Training: Yes/No
   - Notes: Any additional info
5. Upload an image (optional - tests ImageMagick processing)
6. Click "Create Equipment"
7. New equipment appears in list
8. Test quick status changes:
   - Click "Mark Maintenance" to take offline
   - Click "Mark Available" to bring back online
9. Test editing equipment details

**Testing Image Processing:**
1. When adding/editing equipment, upload an image
2. Backend processes with ImageMagick (or Sharp fallback):
   - Creates optimized version (max 1200px)
   - Creates thumbnail (300x300px)
3. Check that thumbnail loads quickly in:
   - Equipment list (staff view)
   - Equipment cards (student view)

### 4. Testing Redis Caching

Redis caches frequently accessed data to improve performance:

**To test caching:**
1. Make first request to `/api/services` (cache miss - hits MongoDB)
2. Check terminal logs: "Cache miss: services"
3. Make second request to `/api/services` (cache hit - from Redis)
4. Check terminal logs: "Cache hit: services"
5. Cache expires after 5 minutes or when data is updated

**Same for equipment:**
1. First request to `/api/equipment` - cache miss
2. Subsequent requests - cache hit
3. When staff adds/edits equipment, cache is invalidated

### 5. Testing RabbitMQ Email Processing

RabbitMQ handles background email sending:

**To test:**
1. Student creates an order
2. Check terminal logs:
   - Backend: "Publishing order confirmation to queue"
   - Worker: "Processing order confirmation email"
   - Worker: "Order confirmation email sent"
3. Check Mailtrap inbox for email
4. If worker is not running, messages queue up in RabbitMQ
5. When worker starts, it processes all queued messages

### 6. Viewing Sample Data

The seed script creates sample data you can explore:

**Orders:**
- 2 submitted orders (waiting for staff action)
- 1 in-progress order (being worked on)
- 1 completed order (ready for pickup)

**Equipment:**
- 3 available items (can be checked out)
- 1 checked out item (in use)
- 1 maintenance item (unavailable)

**Checkouts:**
- 2 pending requests (waiting for approval)
- 1 approved checkout (student has equipment)
- 1 returned checkout (completed)
- 1 denied checkout (with reason)

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Verify MongoDB is running
brew services list | grep mongodb
# or
sudo systemctl status mongodb

# Start MongoDB if not running
brew services start mongodb-community
# or
sudo systemctl start mongodb
```

### Redis Connection Error
```bash
# Verify Redis is running
redis-cli ping  # Should return PONG

# Start Redis if not running
brew services start redis
# or
sudo systemctl start redis
```

### RabbitMQ Connection Error
```bash
# Verify RabbitMQ is running
sudo rabbitmqctl status

# Start RabbitMQ if not running
brew services start rabbitmq
# or
sudo systemctl start rabbitmq-server
```

### Firebase Authentication Error
- Ensure users are created in Firebase Authentication
- Check that Firebase credentials in client/.env.local are correct
- Verify serviceAccountKey.json exists in backend/config/

### Email Not Sending
- Verify email worker is running (Terminal 2 or in concurrently output)
- Check Mailtrap credentials in backend/.env.local
- View queued messages: `sudo rabbitmqctl list_queues`

## Additional Documentation

See `backend/SETUP.md` for detailed backend configuration, troubleshooting, and architecture details.
