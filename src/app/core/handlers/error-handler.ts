import { Injector } from '@angular/core';
import { NgZone } from '@angular/core';
import { Injectable } from '@angular/core';
import { ErrorHandler } from '@angular/core';
import { isDevMode } from '@angular/core';

import { INotification } from 'src/app/types/notification.interface';
import { LoggingService } from '../services/logging-service';
import { HttpLogReadyError } from 'src/app/types/http-log-ready-error.model';
import { ERROR_INOTIFICATONS } from 'src/app/constants/constants';

@Injectable()
export class BasicErrorHandler implements ErrorHandler {
  constructor(private injector: Injector, private zone: NgZone) {}

  handleError(error: HttpLogReadyError | any): void {
    if (isDevMode()) {
      this.logErrorToConsole(error);
    }
    if (error instanceof HttpLogReadyError) {
      return this.logMessage(error.notification);
    }
    error = error.rejected ? error.rejected : error;

    const message: INotification = ERROR_INOTIFICATONS.unhandledException;
    this.logMessage(message);
  }

  logMessage(message: INotification) {
    const loggingService = this.injector.get(LoggingService);
    this.zone.run(() => {
      loggingService.logError(message);
    });
  }

  logErrorToConsole(error: any) {
    console.log('in global error handler, error is');
    console.dir(error);
  }
}
