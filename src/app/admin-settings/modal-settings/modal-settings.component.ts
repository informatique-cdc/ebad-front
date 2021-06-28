import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NormsService, Norme, GlobalSetting, GlobalSettingsService} from '../../core';

@Component({
    selector: 'app-modal-settings',
    templateUrl: './modal-settings.component.html'
})
export class ModalSettingsComponent {
    settings: GlobalSetting = {
        value: undefined,
        key: undefined
    };
    title = 'Global Settings - ' + this.settings.key;


    constructor(public activeModal: NgbActiveModal,
                private globalSettingsService: GlobalSettingsService) {
    }


    sendValue() {
        this.globalSettingsService.changeValue(this.settings.key, this.settings.value).subscribe(
            () => {
                this.activeModal.close();
            },
            error => {
                this.activeModal.dismiss(error);
            }
        );
    }
}
