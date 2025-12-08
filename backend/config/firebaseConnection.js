import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseAuth = null;
let firebaseStorage = null;

try {
  // Try to load service account key
  const serviceAccountPath = join(__dirname, '../serviceAccountKey.json');
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'stevens-fabrication-laboratory.firebasestorage.app'
  });

  firebaseAuth = admin.auth();
  firebaseStorage = admin.storage().bucket();

  console.log('✓ Firebase Admin initialized');
} catch (error) {
  console.log('⚠ Firebase Admin not configured (serviceAccountKey.json not found)');
  console.log('  Download from: Firebase Console → Project Settings → Service Accounts');
}

export { firebaseAuth, firebaseStorage };