import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { HttpException } from './http.exception';

export class UnauthorizedException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.UNAUTHORIZED, message || 'Unauthorized');
  }
}
