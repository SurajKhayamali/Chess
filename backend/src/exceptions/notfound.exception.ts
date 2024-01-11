import { HttpStatusCode } from '../enums/httpStatusCode.enum';
import { HttpException } from './http.exception';

export class NotFoundException extends HttpException {
  constructor(message?: string) {
    super(HttpStatusCode.NOT_FOUND, message || 'Not found');
  }
}
