import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

import { HttpLogReadyError } from 'src/app/types/http-log-ready-error.model';
import { ERROR_INOTIFICATONS, ERROR_INOTIFICATONS_HTTP_CODES } from 'src/app/constants/constants';
import { INotification } from 'src/app/types/notification.interface';
const RETRY_COUNT = 3;

@Injectable()
export class BasicInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(RETRY_COUNT),
      catchError((err) => this.handleHttpError(err))
    );
  }

  handleHttpError(error: HttpErrorResponse) {
    const message: INotification = this.getMessage(error);
    return throwError(() => new HttpLogReadyError(error, message));
  }

  getMessage(error: HttpErrorResponse): INotification {
    if (!navigator.onLine) {
      return ERROR_INOTIFICATONS.navigatorOffline;
    }
    if (error.error instanceof ErrorEvent) {
      return ERROR_INOTIFICATONS.clientSide;
    }
    if (error.status === 0) {
      return ERROR_INOTIFICATONS.apiNetworkError;
    }
    return ERROR_INOTIFICATONS_HTTP_CODES[error.status] || ERROR_INOTIFICATONS.serverSide;
  }
}
