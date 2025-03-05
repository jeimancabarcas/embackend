import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: admin.app.App) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken: string = request.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      await this.firebaseAdmin.auth().verifyIdToken(idToken);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token' + error);
    }
  }
}
