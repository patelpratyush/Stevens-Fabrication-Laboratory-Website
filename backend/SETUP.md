# Backend Setup

Quick guide to get the backend running for our Fab Lab project.

## What You Need

Install these first:

- Node.js (v18 or newer)
- MongoDB
- Redis
- RabbitMQ

## Setup Steps

### 1. Install npm packages

```bash
cd backend
npm install
```

### 2. Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Then fill in your `.env` file with the actual values:

**MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=fablab
```

**Redis:**
```env
REDIS_URL=redis://localhost:6379
```

**RabbitMQ:**
```env
RABBITMQ_URL=amqp://localhost:5672
```

**Mailtrap (for testing emails):**

Go to [mailtrap.io](https://mailtrap.io/), sign up (it's free), create an inbox, and grab your SMTP credentials:

```env
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=<your_username>
MAILTRAP_PASS=<your_password>
STAFF_EMAIL=fablab@stevens.edu
```

### 3. Start MongoDB, Redis, and RabbitMQ

**On Mac (with Homebrew):**

```bash
# Install everything
brew install mongodb-community redis rabbitmq

# Start services
brew services start mongodb-community
brew services start redis
brew services start rabbitmq
```

**On Linux:**

```bash
# Install
sudo apt-get install mongodb redis-server rabbitmq-server

# Start
sudo systemctl start mongodb
sudo systemctl start redis
sudo systemctl start rabbitmq-server
```

**Using Docker (if you prefer):**

```bash
docker run -d -p 27017:27017 --name fablab-mongo mongo:latest
docker run -d -p 6379:6379 --name fablab-redis redis:latest
docker run -d -p 5672:5672 -p 15672:15672 --name fablab-rabbitmq rabbitmq:3-management
```

### 4. Seed the Database

Populate MongoDB with sample services and equipment:

```bash
npm run seed
```

## Running Everything

You need **2 terminal windows** open:

**Terminal 1 - API Server:**
```bash
npm start
```
Server runs on http://localhost:3001

**Terminal 2 - Email Worker:**
```bash
npm run worker
```
This listens for new orders and sends emails.

## Testing the Email System

1. Make sure both terminals are running (server + worker)
2. Create an order through the API or frontend
3. Check the worker terminal - you should see something like:
   ```
   Processing order FAB-251213-1430-A7B2...
   ✓ Confirmation sent to student@stevens.edu
   ✓ Staff notification sent
   ```
4. Go to your Mailtrap inbox - you'll see 2 emails (one for student, one for staff)

## How Redis Caching Works

We're using Redis to cache API responses so things load faster.

**What gets cached:**
- `GET /api/services` → cached for 10 minutes
- `GET /api/equipment` → cached for 10 minutes

**How it works:**
- First request hits the database → slow
- Response gets saved in Redis
- Next requests read from Redis → fast!
- Cache clears automatically when you update services/equipment

**You'll see this in the logs:**
```
✓ Cache HIT: services:all     <-- fast (from Redis)
✗ Cache MISS: equipment:all   <-- slow (from MongoDB)
```

## RabbitMQ Queue System

We use RabbitMQ to send emails in the background without slowing down the API.

**How it works:**

1. Student submits an order → `POST /api/orders`
2. Order gets saved to MongoDB
3. Message gets sent to the `orders.created` queue
4. Worker picks up the message
5. Worker sends 2 emails (student confirmation + staff alert)
6. Done!

**Queue details:**
- **Queue name:** `orders.created`
- **What triggers it:** Creating a new order
- **What it does:** Sends confirmation emails

**Message format (what we send to the queue):**
```json
{
  "orderId": "656f4c5a12ab34cd56ef7890",
  "orderNumber": "FAB-251213-1430-A7B2",
  "user": {
    "email": "student@stevens.edu",
    "name": "John Doe"
  },
  "totalPrice": 42.50,
  "items": [
    {
      "serviceName": "3D Print (PLA)",
      "quantity": 2,
      "lineTotal": 42.50
    }
  ]
}
```

**Monitoring the queue:**

Go to http://localhost:15672 (username/password: guest/guest) to see the RabbitMQ dashboard and check if messages are being processed.

## Image Processing with ImageMagick

We process equipment images to make them load faster on the website.

**Install ImageMagick:**

Mac:
```bash
brew install imagemagick
```

Linux:
```bash
sudo apt-get install imagemagick
```

Check if it's installed:
```bash
convert -version
```

**Process images:**
```bash
npm run process-images
```

This script:
1. Checks if you have ImageMagick installed
2. If yes → uses ImageMagick CLI commands
3. If no → uses Sharp (Node.js library) as backup
4. Creates optimized images (1200px max) and thumbnails (300x300px)
5. Updates MongoDB with the new image paths

**ImageMagick commands we use:**

Optimize:
```bash
convert input.jpg -resize 1200x1200> -quality 90 optimized.jpg
```

Thumbnail:
```bash
convert input.jpg -resize 300x300^ -gravity center -extent 300x300 -quality 80 thumb.jpg
```

## Firebase Service Account Key

**Important:** Don't commit this file to GitHub!

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save it as `backend/serviceAccountKey.json`
4. Make sure it's in `.gitignore` (it already should be)

The file should be here:
```
backend/
├── serviceAccountKey.json  ← this file
├── config/
│   └── firebaseConnection.js  ← loads the key
```

## Troubleshooting

**RabbitMQ won't connect:**
- Check if it's running: `brew services list` (Mac) or `sudo systemctl status rabbitmq-server` (Linux)
- Make sure URL in `.env` is `amqp://localhost:5672`

**Worker not getting messages:**
- Is the worker running? (`npm run worker`)
- Go to http://localhost:15672 and check the `orders.created` queue

**No emails showing up:**
- Check your Mailtrap credentials in `.env`
- Look at worker terminal for errors

**MongoDB errors:**
- Is MongoDB running? Try `mongosh` to connect manually

## Project Structure

```
backend/
├── config/          # MongoDB, Redis, Firebase connections
├── data/            # Database operations
├── middleware/      # Auth checking
├── routes/          # API endpoints
├── queue/           # RabbitMQ publisher
├── worker/          # Email worker (runs separately)
├── utils/           # Image processing, caching
├── scripts/         # Database seeding, image processing
├── .env             # Your secrets (DON'T COMMIT!)
└── server.js        # Main server file
```

## Quick Commands Reference

```bash
npm start              # Start API server
npm run worker         # Start email worker
npm run seed           # Fill database with sample data
npm run process-images # Process equipment images
```

That's it! If you run into issues, check the troubleshooting section or ask in the Discord.
