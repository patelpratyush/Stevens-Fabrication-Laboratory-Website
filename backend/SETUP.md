# Backend Setup Guide

## Prerequisites

Make sure you have the following installed:

- Node.js v18+
- MongoDB
- Redis
- RabbitMQ

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then update the following values in `.env`:

#### MongoDB

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=fablab
```

#### Redis

```env
REDIS_URL=redis://localhost:6379
```

#### RabbitMQ

```env
RABBITMQ_URL=amqp://localhost:5672
```

#### Mailtrap (Email Testing)

1. Sign up at [mailtrap.io](https://mailtrap.io/)
2. Create a new inbox
3. Go to inbox settings and copy the credentials
4. Update your `.env`:

```env
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_username_from_mailtrap
MAILTRAP_PASS=your_password_from_mailtrap
STAFF_EMAIL=fablab@stevens.edu
```

### 3. Install and Start Services

#### macOS (using Homebrew)

```bash
# Install services
brew install mongodb-community redis rabbitmq

# Start MongoDB
brew services start mongodb-community

# Start Redis
brew services start redis

# Start RabbitMQ
brew services start rabbitmq
```

#### Linux (Ubuntu/Debian)

```bash
# Install MongoDB
sudo apt-get install mongodb

# Install Redis
sudo apt-get install redis-server

# Install RabbitMQ
sudo apt-get install rabbitmq-server

# Start services
sudo systemctl start mongodb
sudo systemctl start redis
sudo systemctl start rabbitmq-server
```

#### Using Docker

```bash
# MongoDB
docker run -d -p 27017:27017 --name fablab-mongo mongo:latest

# Redis
docker run -d -p 6379:6379 --name fablab-redis redis:latest

# RabbitMQ
docker run -d -p 5672:5672 -p 15672:15672 --name fablab-rabbitmq rabbitmq:3-management
```

### 4. Seed the Database

```bash
npm run seed
```

This will populate MongoDB with:

- Sample services (3D printing, laser cutting, etc.)
- Sample equipment (cameras, tripods, etc.)
- Sample materials

## Running the Application

You need to run **two separate processes**:

### Terminal 1: API Server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

Server will start on `http://localhost:3001`

### Terminal 2: Email Worker

```bash
npm run worker
```

The worker listens for new orders and sends emails via Mailtrap.

## Verifying Setup

### Check Services Are Running

```bash
# MongoDB
mongosh --eval "db.version()"

# Redis
redis-cli ping
# Should return: PONG

# RabbitMQ
curl http://localhost:15672
# Should show RabbitMQ management UI (user: guest, pass: guest)
```

### Test the Email Flow

1. Start both the server and worker
2. Create an order through the API or frontend
3. Check the worker terminal - you should see:

   ```text
   Processing order FAB-xxx...
   ✓ Confirmation sent to student@stevens.edu
   ✓ Staff notification sent
   ```

4. Check your Mailtrap inbox - you should see 2 emails

## Troubleshooting

### RabbitMQ Connection Failed

If you see `⚠ RabbitMQ connection failed`:

1. Check RabbitMQ is running:

   ```bash
   brew services list  # macOS
   sudo systemctl status rabbitmq-server  # Linux
   ```

2. Verify connection URL in `.env` is correct:

   ```env
   RABBITMQ_URL=amqp://localhost:5672
   ```

### Worker Not Receiving Messages

1. Make sure worker is running (`npm run worker`)
2. Check RabbitMQ management UI: <http://localhost:15672>
   - Username: `guest`
   - Password: `guest`
3. Look for the `orders.created` queue - it should have messages if orders were created

### Mailtrap Emails Not Sending

1. Verify your Mailtrap credentials in `.env`
2. Check the worker terminal for error messages
3. Log into Mailtrap and verify your inbox is active

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
brew services list  # macOS
sudo systemctl status mongodb  # Linux

# Try connecting manually
mongosh mongodb://localhost:27017
```

## Project Structure

```text
backend/
├── config/          # Database and service connections
├── data/            # Data access layer
├── middleware/      # Auth and other middleware
├── routes/          # API endpoints
├── queue/           # RabbitMQ publisher
├── worker/          # Email worker (separate process)
├── utils/           # Image processing, helpers
├── scripts/         # Database seed scripts
└── server.js        # Main entry point
```

## API Endpoints

See main README for full API documentation.

## Image Processing (ImageMagick/Sharp)

The backend uses Sharp to automatically optimize and generate thumbnails for equipment images.

### Process All Equipment Images

```bash
npm run process-images
```

This script:

- Finds all equipment with `imageUrl` in the database
- Downloads/reads the images
- Creates optimized versions (max 1200px width)
- Generates thumbnails (300x300px)
- Updates MongoDB with new `imageUrl` and `thumbUrl` paths

### Process Single Equipment

```bash
npm run process-images <equipment-id>
```

### How It Works

1. Staff uploads equipment image (via frontend or direct MongoDB insert)
2. Run `npm run process-images` to batch process all images
3. Script saves optimized images to `/backend/uploads/equipment/`
4. Database updated with paths:
   - `imageUrl`: `/backend/uploads/equipment/camera_optimized.jpg`
   - `thumbUrl`: `/backend/uploads/equipment/camera_thumb.jpg`
5. Frontend displays thumbnails for fast loading

## Redis Caching

The backend uses Redis to cache frequently accessed data for improved performance.

### Cached Endpoints

| Endpoint | Cache Key | TTL |
|----------|-----------|-----|
| `GET /api/services` | `services:all` | 10 minutes |
| `GET /api/equipment` | `equipment:all` | 10 minutes |

### Cache Invalidation

Cache is automatically invalidated when data changes:

- Creating/updating a service → Clears `services:*` cache
- Creating/updating equipment → Clears `equipment:*` cache

### Viewing Cache Activity

Watch backend logs for cache hits/misses:

```text
✓ Cache HIT: services:all
✗ Cache MISS: equipment:all
```

## RabbitMQ Queue System

The email notification system uses RabbitMQ for asynchronous processing.

### Queue Details

**Queue Name:** `orders.created`

**Trigger:** When a new order is created via `POST /api/orders`

**Message Format:**

```json
{
  "orderId": "656f4c5a12ab34cd56ef7890",
  "orderNumber": "FAB-251213-1430-A7B2",
  "user": {
    "firebaseUid": "firebase-uid",
    "email": "student@stevens.edu",
    "name": "Student Name"
  },
  "totalPrice": 42.50,
  "items": [
    {
      "serviceName": "3D Print (PLA)",
      "materialName": "PLA - standard",
      "quantity": 2,
      "unitPrice": 21.25,
      "lineTotal": 42.50
    }
  ],
  "files": [
    {
      "url": "https://firebasestorage.googleapis.com/.../design.stl",
      "name": "part-v1.stl"
    }
  ],
  "createdAt": "2025-12-13T15:30:00.000Z"
}
```

### Email Flow

1. **Order Created** → Backend publishes message to `orders.created` queue
2. **Worker Consumes** → Email worker picks up message
3. **Emails Sent:**
   - Student confirmation email (order summary)
   - Staff notification email (new order alert)
4. **Message Acknowledged** → Removed from queue

### Monitoring Queue

Access RabbitMQ Management UI: <http://localhost:15672>

- Username: `guest`
- Password: `guest`

Check `orders.created` queue for:

- Message count
- Consumer status
- Message rate

## ImageMagick Usage

The image processing script automatically detects and uses ImageMagick CLI if installed.

### Installation

**macOS:**

```bash
brew install imagemagick
```

**Linux:**

```bash
sudo apt-get install imagemagick
```

**Verify Installation:**

```bash
convert -version
# Should output: Version: ImageMagick 7.x.x
```

### Processing Pipeline

When you run `npm run process-images`:

1. **Check for ImageMagick** - Script detects if `convert` command is available
2. **Process Images:**
   - **With ImageMagick:** Uses CLI commands (`convert`)
   - **Without ImageMagick:** Falls back to Sharp (Node.js library)
3. **Output:**
   - Optimized image: 1200px max width, 90% quality
   - Thumbnail: 300x300px cropped, 80% quality

### ImageMagick Commands Used

**Optimize:**

```bash
convert input.jpg -resize 1200x1200> -quality 90 optimized.jpg
```

**Thumbnail:**

```bash
convert input.jpg -resize 300x300^ -gravity center -extent 300x300 -quality 80 thumb.jpg
```

## Firebase Service Account Key

**IMPORTANT:** The service account key is required for backend authentication but should **NEVER** be committed to Git.

### Setup

1. Download key from Firebase Console:
   - Go to Project Settings → Service Accounts
   - Click "Generate New Private Key"
2. Save as `backend/serviceAccountKey.json`
3. Verify it's in `.gitignore`:

```bash
grep serviceAccountKey.json backend/.gitignore
# Should output: serviceAccountKey.json
```

### File Location

```text
backend/
├── serviceAccountKey.json  ← Place here (NEVER commit!)
├── config/
│   └── firebaseConnection.js  ← Loads the key
```

## Next Steps

After setup:

1. Test the API with Postman or the frontend
2. Create test orders to verify email flow
3. Run `npm run process-images` to generate equipment thumbnails
4. Verify Redis caching with cache hit/miss logs
5. Check RabbitMQ management UI for queue activity
