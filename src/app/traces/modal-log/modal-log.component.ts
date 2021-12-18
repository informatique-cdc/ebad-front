import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-modal-log',
    templateUrl: './modal-log.component.html'
})
export class ModalLogComponent implements OnInit {
    title = '';
    isLogerr: boolean;
    log: string;

    constructor(public activeModal: NgbActiveModal,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        if (this.isLogerr) {
            this.translateService.get('TRACE.ACTION.LOGOUT')
                .subscribe((msg) => this.title = msg);
        } else {
            this.translateService.get('TRACE.ACTION.LOGERR')
                .subscribe((msg) => this.title = msg);
        }
    }
}
