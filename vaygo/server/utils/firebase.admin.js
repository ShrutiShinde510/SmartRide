const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length) {
  const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'));
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log('Firebase Admin initialized');
}

module.exports = admin;
