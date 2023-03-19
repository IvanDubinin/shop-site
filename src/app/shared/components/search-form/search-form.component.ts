import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent {
  @Input() placeholder: string;
  @Output() searchSubmit = new EventEmitter<string>();

  search: string;

  change(event: Event) {
    this.search = (event.target as HTMLSelectElement).value;
  }

  onSubmit() {
    this.searchSubmit.emit(this.search);
  }
}
