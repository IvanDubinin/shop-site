import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

export interface ISelect {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-drop-down',
  templateUrl: './drop-down.component.html'
})
export class DropDownComponent implements OnChanges {
  @Input() label: string;
  @Input() options: ISelect[] | null;
  @Input() defaultOption: string;
  @Input() filtersAreReseted: boolean;

  @Output() selectedValue = new EventEmitter<string>();

  selectOption(value: string) {
    this.selectedValue.emit(value);
  }

  ngOnChanges() {
    if (this.filtersAreReseted) {
      this.selectOption('All');
      this.defaultOption = 'All';
    }
  }
}
