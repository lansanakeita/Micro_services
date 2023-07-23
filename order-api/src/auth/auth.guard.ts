import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthApiGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToRpc().getContext();
    const request = context.switchToHttp().getRequest();

    const token = ctx.get('authorization')?.toString().split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Aucun token fourni');
    }

    try {
      const validateResponse = this.authService.validate({ token });
      const { status, userId } = validateResponse;

      if (status === HttpStatus.OK) {
        request.userId = userId;
        return true;
      } else {
        throw new UnauthorizedException('Token non valide');
      }
    } catch (err) {
      throw new UnauthorizedException('Erreur lors de la validation du token');
    }
  }
}
