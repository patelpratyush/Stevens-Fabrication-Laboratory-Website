import admin from 'firebase-admin';
import { settings } from './settings.js';

// Temporarily skip Firebase - uncomment when you have credentials
/*
const serviceAccount = {
  type: "service_account",
  project_id: "your-project-id",
  private_key_id: "your-private-key-id",
  private_key: "your-private-key",
  client_email: "your-client-email",
  client_id: "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "your-cert-url"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: settings.firebase.storageBucket
});

export const firebaseAuth = admin.auth();
export const firebaseStorage = admin.storage().bucket();
*/

// Export null until Firebase is configured
export const firebaseAuth = null;
export const firebaseStorage = null;

console.log('⚠ Firebase skipped (not configured yet)');