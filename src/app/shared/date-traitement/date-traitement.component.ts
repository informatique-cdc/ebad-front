import {Component, Input, OnInit} from '@angular/core';
import {InfoEnvironment, EnvironmentsService} from '../../core';
import {ModalDateTraitementComponent} from './modal-date-traitement';
import {DatePipe} from '@angular/common';
import {NgbDateParserFormatter, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ebad-date-traitement',
  templateUrl: './date-traitement.component.html',
  styleUrls: ['./date-traitement.component.scss']
})
export class DateTraitementComponent implements OnInit {
  @Input() infoEnvironment: InfoEnvironment;

  constructor(
    private modalService: NgbModal,
    private environmentService: EnvironmentsService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
  }

  showModalCalendar() {
    const modalRef = this.modalService.open(ModalDateTraitementComponent);
    modalRef.result.then((result) => {
      const dateStr = this.datePipe.transform(result, 'dd/MM/yyyy');
      this.environmentService.changeDateTraitement(this.infoEnvironment.id, {dateTraitement: dateStr}).subscribe(
        () => {
          this.infoEnvironment.dateTraitement = result;
        }
      );
    }, (reason) => {
      console.debug(`Dismissed ${reason}`);
    });
    const dateTraitement = new Date(this.infoEnvironment.dateTraitement);
    modalRef.componentInstance.dateTraitement = this.ngbDateParserFormatter.parse(this.datePipe.transform(dateTraitement, 'dd/MM/yyyy'));
  }

}
