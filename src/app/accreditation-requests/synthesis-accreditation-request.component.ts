import {Component} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalRequestComponent} from './modal-request/modal-request.component';

@Component({
  selector: 'app-synthesis-accreditation-request',
  templateUrl: './synthesis-accreditation-request.component.html'
})
export class SynthesisAccreditationRequestComponent {

  constructor(private modalService: NgbModal) {}

  requestAccreditation(){
    const modalRef = this.modalService.open(ModalRequestComponent);
    modalRef.result.then();
  }
}

