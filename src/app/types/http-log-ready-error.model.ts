import { HttpErrorResponse } from '@angular/common/http';
import { INotification } from './notification.interface';

export class HttpLogReadyError extends HttpErrorResponse {
  constructor(originalErrorResponse: HttpErrorResponse, public notification: INotification) {
    super({ ...originalErrorResponse.error });
  }
}
