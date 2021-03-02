import {Component, Input} from '@angular/core';

@Component({
  selector: 'ebad-show-hide-column',
  templateUrl: 'show-hide-column.component.html'
})
export class ShowHideColumnComponent {
  @Input() datatableInstance: Promise<DataTables.Api>;
  @Input() columns: any[]

  toggleVisibility(index) {
    this.datatableInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.column(index).visible(!this.columns[index].visible);
      this.columns[index].visible = !this.columns[index].visible
    });
  }
}
