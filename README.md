# Stevens Fabrication Laboratory Website

Web application for the Stevens Fab Lab to manage service orders, equipment checkouts, and pricing. Replaces their current manual  processes and third-party systems with an integrated platform.

## Team Members

- Pratyush Patel - 20010352
- Jasmine Cairns - 10458274
- David Amin - 20013543

## What's in This Project

So we're submitting:

- All the code (frontend and backend)
- The `.env` files are included (backend/.env.local and client/.env.local)
  - Usually these would be gitignored but we put them in so you can test it easily
  - Has all the MongoDB, Redis, RabbitMQ, Mailtrap, and Firebase stuff already set up
- Firebase service account key (backend/config/serviceAccountKey.json)
  - Needed for backend auth, we included it so you don't have to set it up
- Seed script (backend/scripts/seed.js) with some test data
  - Makes 2 users, 25 services, 7 equipment items, 4 orders, 4 checkouts
- All the dependencies in package.json
- This README with setup instructions

Everything should be ready to go - just install stuff, run the seed, and start it up!

## What You Need to Install

You'll need these things installed:

- Node.js v18+ (we used v25.2.1)
- MongoDB (community edition works fine)
- Redis
- RabbitMQ
- ImageMagick (optional - if you don't have it, it'll use Sharp instead)

### How to Install (Mac with Homebrew)

```bash
brew install mongodb-community redis rabbitmq imagemagick
brew services start mongodb-community
brew services start redis
brew services start rabbitmq
```

### How to Install (Linux)

```bash
sudo apt-get update
sudo apt-get install mongodb redis-server rabbitmq-server imagemagick
sudo systemctl start mongodb
sudo systemctl start redis
sudo systemctl start rabbitmq-server
```

### Make Sure Everything is Running

```bash
# Check MongoDB
mongosh --eval "db.version()"

# Check Redis (should say PONG)
redis-cli ping

# Check RabbitMQ
sudo rabbitmqctl status

# Check ImageMagick (if you installed it)
convert -version
```

## Setup Instructions

### Step 1: Get the Project

```bash
unzip Stevens-Fabrication-Laboratory-Website.zip
cd Stevens-Fabrication-Laboratory-Website
```

### Step 2: Install Everything

First install root dependencies:

```bash
npm install
```

Then backend:

```bash
cd backend
npm install
cd ..
```

Then frontend:

```bash
cd client
npm install
cd ..
```

### Step 3: Environment Stuff

**Important:** We included all the `.env` files and Firebase credentials in the submission so you can test it right away. Normally you wouldn't commit these but we did it for grading purposes.

The files that are already set up:

- `backend/.env.local` - Has MongoDB, Redis, RabbitMQ, Mailtrap, and Firebase config
- `client/.env.local` - Frontend Firebase stuff
- `backend/config/serviceAccountKey.json` - Firebase admin key for backend

You don't need to change anything! Just install dependencies, seed the db, and run it.

### Step 4: Seed the Database

Run this to add some test data:

```bash
cd backend
npm run seed
```

This creates:

- 4 users (1 staff, 3 students)
- 7 services (3D printing, laser cutting, etc.)
- 7 equipment items
- 4 orders
- 5 checkout requests

You should see something like:

```bash
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

## How to Run It

### Easy Way (One Command)

From the root directory just run:

```bash
npm start
```

This starts everything at once:

- Backend API (port 3001)
- Email worker (runs in background)
- Frontend (port 3000)

You should see output like:

```bash
[0] ✓ MongoDB connected
[0] ✓ Redis connected
[0] ✓ RabbitMQ connected
[0] ✓ Server running on http://localhost:3001
[1] ✓ Email worker connected to RabbitMQ
[1] Waiting for orders on queue: orders.created...
[2] ▲ Next.js 16.0.10 (Turbopack)
[2] - Local: http://localhost:3000
```

### Or Run Each Part Separately

If you want to run them in different terminals:

**Terminal 1 - Backend:**

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

### Open It Up

Once everything is running, go to:

**<http://localhost:3000>**

## How It's Built

Basically two main parts:

**Frontend** - Next.js React app (runs on port 3000)
**Backend** - Express API server that talks to MongoDB, Redis, RabbitMQ, and Firebase (port 3001)

## Technologies We Used

### Course Requirements

**Next.js**
Used for the frontend. Does server-side rendering and stuff.

**Firebase**
Handles login (email/password) and stores uploaded files like STL and PDF files.

**Redis**
We use it to cache services and equipment lists so the API is faster.

### Extra Technologies We Added

**MongoDB**
Main database. Stores users, services, orders, equipment, and checkout stuff.

**RabbitMQ**
Message queue for sending emails in the background. When someone creates an order, it queues up an email and a worker process sends it without slowing down the API.

**ImageMagick**
For processing images. Makes thumbnails and optimizes equipment photos. If you don't have it installed, it'll use Sharp instead (a Node.js library).

## Test Users

### Setting Up Users in Firebase

You need to create these users in Firebase before you can test:

1. Go to [Firebase Console](https://console.firebase.google.com/project/stevens-fabrication-laboratory/authentication/users)
2. Click "Add User"
3. Create these accounts:

**Staff:**

- Email: `staff@stevens.edu`
- Password: `password123`

**Student:**

- Email: `student@stevens.edu`
- Password: `password123`

## How to Test It

### 1. Testing Orders

**As a Student:**

1. Log in with `student@stevens.edu`
2. Go to "Services" page
3. Click on a service like "PLA 3D Print"
4. Enter quantity (like 100 grams)
5. Add notes if you want
6. Click "Submit Order"
7. You should see a confirmation with an order number (looks like FAB-241213-1430-A7B2)
8. Go to "My Orders" to see your order with "submitted" status

**As Staff:**

1. Log in with `staff@stevens.edu`
2. Go to "Orders" page
3. You should see all the orders including the one you just made
4. Click on an order to see details
5. Change status to "in-progress"
6. Do the work...
7. Change status to "ready" when done
8. The student will see the updated status in their "My Orders"

**Email Testing:**

- When someone creates an order, check Mailtrap at <https://mailtrap.io>
- You should see an email sent to the staff email

### 2. Testing Equipment Checkout

**As a Student:**

1. Log in with `student@stevens.edu`
2. Go to "Equipment" page
3. Find something available (has a green badge)
4. Click "Request Checkout"
5. Pick a due date
6. Add notes about why you need it
7. Submit
8. Go to "My Checkouts" to see it's "pending"

**As Staff:**

1. Log in with `staff@stevens.edu`
2. Go to "Checkouts" page
3. See all the pending requests
4. Click "Approve" or "Deny" (add a reason if denying)
5. If you approve:
   - Equipment becomes "checked_out"
   - Student sees "approved" status
   - Other people can't check it out anymore
6. When student returns it:
   - Click "Mark as Returned"
   - Equipment goes back to "available"

### 3. Testing Equipment Management

**As Staff:**

1. Log in with `staff@stevens.edu`
2. Go to "Equipment" page
3. Click "Add Equipment"
4. Fill out the form:
   - Name: Test Equipment
   - Category: 3D Printing
   - Location: Fab Lab - Station 1
   - Status: Available
   - Requires Training: Yes/No
   - Notes: whatever
5. Upload an image if you want (tests ImageMagick)
6. Click "Create Equipment"
7. Should show up in the list
8. Try changing status:
   - "Mark Maintenance" to take it offline
   - "Mark Available" to bring it back
9. Try editing equipment details too

**Image Processing:**

1. When you add/edit equipment with an image, the backend processes it
2. Uses ImageMagick (or Sharp if ImageMagick isn't installed):
   - Makes an optimized version (max 1200px)
   - Makes a thumbnail (300x300px)
3. Check that thumbnails load fast in:
   - Equipment list (staff view)
   - Equipment cards (student view)

### 4. Testing Redis Caching

Redis caches stuff to make it faster:

**How to test:**

1. Make a request to `/api/services` (first time - cache miss, hits MongoDB)
2. Check terminal - should say "Cache miss: services"
3. Make another request to `/api/services` (should be cache hit from Redis)
4. Check terminal - should say "Cache hit: services"
5. Cache expires after 5 minutes or when you update data

**Same thing for equipment:**

1. First request to `/api/equipment` - cache miss
2. Next requests - cache hit
3. When staff adds/edits equipment, cache gets cleared

### 5. Testing RabbitMQ Email Stuff

RabbitMQ sends emails in the background:

**To test:**

1. Have a student create an order
2. Check terminal logs:
   - Backend should say "Publishing order confirmation to queue"
   - Worker should say "Processing order confirmation email"
   - Worker should say "Order confirmation email sent"
3. Check Mailtrap for the email
4. If the worker isn't running, messages will queue up in RabbitMQ
5. When you start the worker, it processes all the queued messages

### 6. Sample Data

The seed script makes some test data you can look at:

**Orders:**

- 2 submitted (waiting for staff)
- 1 in-progress (being worked on)
- 1 completed (ready to pick up)

**Equipment:**

- 3 available (can checkout)
- 1 checked out (in use)
- 1 maintenance (unavailable)

**Checkouts:**

- 2 pending (waiting for approval)
- 1 approved (student has it)
- 1 returned (done)
- 1 denied (with reason)

## Additional Documentation

See `backend/SETUP.md` for detailed backend configuration, troubleshooting, and architecture details.
