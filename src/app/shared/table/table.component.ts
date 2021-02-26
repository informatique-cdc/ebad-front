import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ColumnsDefinition, Table} from './table.model';
import {ActionClickEvent} from './action-click-event.model';
import {KeyValue} from '@angular/common';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() title: string;
  @Input() table: Table;
  valueAscOrder;
  dtOptions: DataTables.Settings = {
    language: {
      url: 'assets/i18n/datatable-fr.json'
    }
  };

  @Output() actionClicked = new EventEmitter<ActionClickEvent>();

  ngOnInit() {
    this.valueAscOrder = (a: KeyValue<number, ColumnsDefinition>, b: KeyValue<number, ColumnsDefinition>): number => {
      if (a.value.order > b.value.order) {
        return 1;
      }
      return -1;
    };
  }


  onClick(event, item) {
    this.actionClicked.emit(new ActionClickEvent(event.target.name, item));
  }
}
