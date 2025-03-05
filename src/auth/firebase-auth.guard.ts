import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const idToken = request.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decodedToken = this.firebaseService.getAuth().auth(idToken)
      request.user = decodedToken; 
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
