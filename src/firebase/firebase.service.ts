import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService {
  constructor(private configService: ConfigService) { }
  getAuth() {
    const serviceAccount: ServiceAccount = ({
      projectId: this.configService.get<string>('FIREBASE_PROJECT_ID'),
      clientEmail: this.configService.get<string>('FIREBASE_CLIENT_EMAIL'),
      privateKey: this.configService.get<string>('FIREBASE_PRIVATE_KEY'.replace(/\\n/g, '\n')),
    })

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    return admin;
  }
}