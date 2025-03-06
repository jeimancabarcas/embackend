import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
    private authService: AuthService
  ) {}

 @Post('login')
 async login(@Body() createUserDto: CreateAuthDto){
  
  try {
    const customToken = await this.authService.verifyCredentials(createUserDto);
    return {
      customToken,
      message: 'Session sucessfull'
    };
  } catch (error) {
    throw new Error(' CustomToken Invalid' + error );
  }
 }
}
