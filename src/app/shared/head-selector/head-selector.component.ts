import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {EventSelectChangeModel} from './event-select-change.model';
import {Select} from './select.model';

@Component({
  selector: 'app-head-selector',
  templateUrl: './head-selector.component.html',
  styleUrls: ['./head-selector.component.scss']
})
export class HeadSelectorComponent implements OnInit {
  @Input() title: string;
  @Input() preTitle: string;
  @Input() selects: Select[];

  @Output() changed = new EventEmitter<EventSelectChangeModel>();

  constructor() {
  }

  ngOnInit() {
  }

  onSelect(event, indexSelect) {
    const value = this.selects[indexSelect].options[event.target.value].value;
    const change = new EventSelectChangeModel(event.target.id, value);
    this.changed.emit(change);
  }
}
