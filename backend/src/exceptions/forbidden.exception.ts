import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { HttpException } from './http.exception';

export class ForbiddenException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.FORBIDDEN, message || 'Forbidden');
  }
}
