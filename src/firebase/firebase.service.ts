import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
    constructor(private configService: ConfigService){}
    onModuleInit() {
        const firebaseConfigString = this.configService.get<string>('FIREBASE_CONFIG_ACCOUNT') as string;
        const firebaseConfig = JSON.parse(firebaseConfigString) as ServiceAccount;  

        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
          });
    }
    getAuth() {
        return admin;
      }
}
