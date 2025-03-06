import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateAuthDto } from './dto/create-auth.dto';

@Injectable()
export class AuthService {

  constructor(@Inject('FIREBASE_ADMIN')private readonly firebaseAdmin: admin.app.App){}

  async verifyCredentials( createAuthDto: CreateAuthDto ): Promise< string >{
    try {
      const userRecord = await this.firebaseAdmin.auth().getUserByEmail(createAuthDto.email);
      const customToken = await this.firebaseAdmin.auth().createCustomToken(userRecord.uid);
      return customToken;
    } catch (error) {
      throw new Error('There are with Credentials: ' + error) ;
    }
  }
}
