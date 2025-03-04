import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfigString = process.env.FIREBASE_CONFIG_ACCOUNT || "{}";

const firebaseConfig = JSON.parse(firebaseConfigString)as ServiceAccount;

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export { admin };
