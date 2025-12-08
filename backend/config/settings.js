import dotenv from 'dotenv';
dotenv.config();

export const settings = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
    dbName: process.env.MONGODB_DB_NAME || 'fablab'
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  firebase: {
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'stevens-fabrication-laboratory.firebasestorage.app'
  },
  server: {
    port: parseInt(process.env.PORT) || 3001
  }
};
