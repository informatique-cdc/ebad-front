import {Component, Input} from '@angular/core';
import {DataTableDirective} from 'angular-datatables';

@Component({
  selector: 'ebad-show-hide-column',
  templateUrl: 'show-hide-column.component.html'
})
export class ShowHideColumnComponent {
  @Input() datatableElement: DataTableDirective;
  @Input() columns: any[];

  toggleVisibility(index) {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(index).visible(!this.columns[index].visible);
      this.columns[index].visible = !this.columns[index].visible
    });
  }
}
