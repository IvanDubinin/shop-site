import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { CustomSnackBarComponent } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.component';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

import { MODAL_DISMISS_TIMEOUT } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.settings';
import {
  IInnerNotification,
  INotification,
  IInnerNotificationType
} from 'src/app/types/notification.interface';
import { environment } from '../../../environments/environment';

const DEFAULT_MESSAGE_TTL = 3000;

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  messages$: BehaviorSubject<Map<number, IInnerNotification>> = new BehaviorSubject(
    new Map<number, IInnerNotification>()
  );
  timeouts: Map<number, number> = new Map<number, number>();
  snackBarRemovalTimeout: number | null;
  index: number = 0;
  snackBarRef: MatSnackBarRef<CustomSnackBarComponent> | null;

  constructor(private snackbar: MatSnackBar) {}

  private async logMessage(message: IInnerNotification) {
    this.index = this.pickFirstAvailableIndex();
    await this.manageSnackBarState();
    const correctedMessage: IInnerNotification = {
      ...message,
      removeByTimeout: message.removeByTimeout
        ? message.removeByTimeout
        : environment.defaultNotificationTimeout,
      isKeptOpen: message.isKeptOpen ? message.isKeptOpen : false
    };
    this.populateMessage(this.index, correctedMessage);
    if (!correctedMessage.isKeptOpen) {
      this.addTimeout(this.index, correctedMessage.removeByTimeout);
    }
  }

  logError(message: INotification) {
    this.logMessage(this.setUpInnerNotification(message, 'error'));
  }

  logInformation(message: INotification) {
    this.logMessage(this.setUpInnerNotification(message, 'information'));
  }

  logBusinessAction(message: INotification) {
    this.logMessage(this.setUpInnerNotification(message, 'business-action'));
  }

  clearTimeoutOnHover(index: number) {
    const timerId = this.timeouts.get(index);
    if (timerId) {
      clearTimeout(timerId);
    }
  }

  closeMessage(index: number) {
    this.messages$.value.delete(index);
    if (this.messages$.value.size === 0) {
      this.dismissSnackBar();
    }
    clearTimeout(this.timeouts.get(index));
  }

  addTimeout(index: number, customTimeout: number | null = null) {
    const timeout = setTimeout(() => {
      this.closeMessage(index);
    }, customTimeout || DEFAULT_MESSAGE_TTL);
    this.timeouts.set(index, Number(timeout));
  }

  private async manageSnackBarState() {
    if (!this.snackBarRef) {
      this.snackBarRef = this.openSnackBar();
      await lastValueFrom(this.snackBarRef.afterOpened());
    } else if (this.snackBarRemovalTimeout) {
      clearTimeout(this.snackBarRemovalTimeout);
      this.snackBarRemovalTimeout = null;
    }
  }

  private openSnackBar() {
    return this.snackbar.openFromComponent(CustomSnackBarComponent, {
      data: {
        message: this.messages$
      },
      horizontalPosition: 'right'
    });
  }

  private dismissSnackBar() {
    this.snackBarRemovalTimeout = Number(
      setTimeout(() => {
        this.snackBarRef!.dismiss();
        this.snackBarRef = null;
      }, MODAL_DISMISS_TIMEOUT)
    );
    this.index = 0;
    this.messages$.value.clear();
  }

  private populateMessage(index: number, message: IInnerNotification) {
    this.messages$.next(this.messages$.value.set(index, message));
  }

  private setUpInnerNotification(
    message: INotification,
    type: IInnerNotificationType
  ): IInnerNotification {
    return { ...message, type };
  }

  private pickFirstAvailableIndex(): number {
    let nextIndex: number;
    for (let i = 0; ; i++) {
      if (this.messages$.value.has(i)) {
        continue;
      }
      nextIndex = i;
      break;
    }
    return nextIndex!;
  }
}
