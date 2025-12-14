# Stevens Fabrication Laboratory Website

Web application for the Stevens Fab Lab to manage service orders, equipment checkouts, and pricing. Replaces their current manual processes and third-party systems with an integrated platform.

## Team Members
- Pratyush Patel - 20010352
- Jasmine Cairns - 10458274
- David Amin - 20013543

## Prerequisites
- Node.js v18+
- MongoDB
- Redis
- RabbitMQ

**Mac:**
```bash
brew install mongodb-community redis rabbitmq
brew services start mongodb-community redis rabbitmq
```

**Linux:**
```bash
sudo apt-get install mongodb redis-server rabbitmq-server
sudo systemctl start mongodb redis rabbitmq-server
```

## Installation

**Clone and install dependencies:**
```bash
git clone https://github.com/patelpratyush/Stevens-Fabrication-Laboratory-Website.git
cd Stevens-Fabrication-Laboratory-Website
cd backend && npm install
cd ../client && npm install
```

**Configure backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with MongoDB, Redis, RabbitMQ, Mailtrap, and Firebase credentials
npm run seed
```

**Configure frontend:**
```bash
cd client
cp .env.local.example .env.local
# Edit .env.local with Firebase config
```

**Firebase Service Account:**
- Firebase Console → Project Settings → Service Accounts → Generate New Private Key
- Save as `backend/serviceAccountKey.json`

**Mailtrap (Email Testing):**
- Sign up at https://mailtrap.io (free)
- Create an inbox and get SMTP credentials
- Add to `backend/.env`:
  ```
  MAILTRAP_USER=your_username
  MAILTRAP_PASS=your_password
  ```

## Running the Application

**Option 1: Using Concurrently (One Command)**

At the root directory:
```bash
npm install
npm start
```

This runs backend + worker + frontend simultaneously.

**Option 2: Using Separate Terminals**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Email Worker:
```bash
cd backend
npm run worker
```

Terminal 3 - Frontend:
```bash
cd client
npm run dev
```

Application runs on http://localhost:3000

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

## Additional Documentation

See `backend/SETUP.md` for detailed backend configuration, troubleshooting, and architecture details.
