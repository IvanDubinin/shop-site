import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-for-view-mode',
  templateUrl: './toggle-for-view-mode.component.html',
  styleUrls: ['./toggle-for-view-mode.component.scss']
})
export class ToggleForViewModeComponent {
  @Output() dataChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() viewMode: string = 'list';
  constructor() {}

  public onValChange(value: string) {
    this.dataChanged.emit({ value });
  }
}
