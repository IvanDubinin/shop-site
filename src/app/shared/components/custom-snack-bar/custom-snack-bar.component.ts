import { animate, style, transition, trigger } from '@angular/animations';
import { OnDestroy } from '@angular/core';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoggingService } from 'src/app/core/services/logging-service';
import { IInnerNotification } from 'src/app/types/notification.interface';

import {
  animations,
  SNACK_BAR_ICONS,
  SNACK_BAR_SIZE,
  SNACK_BAR_VIEWMODES
} from './custom-snack-bar.settings';
const resideThreshold = 600;
@Component({
  selector: 'app-custom-snack-bar',
  templateUrl: './custom-snack-bar.component.html',
  styleUrls: ['./custom-snack-bar.component.scss'],
  animations: [
    trigger(animations.name, [
      transition(animations.leave.effectName, [
        style(animations.leave.startStyle),
        animate(animations.leave.timings, style(animations.leave.endStyle))
      ]),
      transition(animations.enter.effectName, [
        style(animations.enter.startStyle),
        animate(animations.enter.timings, style(animations.enter.endStyle))
      ])
    ])
  ]
})
export class CustomSnackBarComponent implements OnInit, OnDestroy {
  cardSize = SNACK_BAR_SIZE;
  icons = SNACK_BAR_ICONS;
  messages$: Observable<Map<number, IInnerNotification>>;
  viewmode: 'desktop' | 'mobile' = 'desktop';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: {
      message: BehaviorSubject<Map<number, IInnerNotification>>;
    },
    private loggingService: LoggingService
  ) {}

  ngOnInit(): void {
    this.messages$ = this.data.message;
    this.setViewMode();
    window.addEventListener('resize', this.resizeCb.bind(this));
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeCb);
  }

  setViewMode() {
    this.viewmode =
      window.innerWidth < resideThreshold
        ? SNACK_BAR_VIEWMODES.mobile
        : SNACK_BAR_VIEWMODES.desktop;
  }

  resizeCb() {
    if (
      (window.innerWidth < resideThreshold && this.viewmode === SNACK_BAR_VIEWMODES.desktop) ||
      (window.innerWidth >= resideThreshold && this.viewmode === SNACK_BAR_VIEWMODES.mobile)
    ) {
      this.setViewMode();
    }
  }

  identifyNew(index: number, message: any) {
    return message.key;
  }

  close(index: number) {
    this.loggingService.closeMessage(index);
  }

  disableCardDisappear(itemId: number) {
    this.loggingService.clearTimeoutOnHover(itemId);
  }

  setCardToDisappear(
    itemId: number,
    removeByTimeout: number | undefined,
    isKeptOpen: boolean | undefined
  ) {
    if (!isKeptOpen) {
      this.loggingService.addTimeout(itemId, removeByTimeout);
    }
  }
}
