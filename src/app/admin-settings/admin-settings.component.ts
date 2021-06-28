import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {GlobalSetting, GlobalSettingsService} from '../core';
import {ModalNormComponent} from '../admin-norms/modal-norm/modal-norm.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalSettingsComponent} from './modal-settings/modal-settings.component';
import {ToastService} from '../core/services/toast.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './admin-settings.component.html'
})
export class AdminSettingsComponent implements OnInit {
  settings: GlobalSetting[] = [];
  isSubmitting = false;

  constructor(
    private router: Router,
    private globalSettingService: GlobalSettingsService,
    private toastService: ToastService,
    private modalService: NgbModal,
  ) {

  }

  ngOnInit() {
    this.globalSettingService.getAllSettings().subscribe(
      (data) => this.settings = data
    );
  }

  onClickChangeValue(settings: GlobalSetting) {
    const modalRef = this.modalService.open(ModalSettingsComponent);
    modalRef.result.then(() => {
      this.toastService.showSuccess(`Global settings is saved`);
      this.globalSettingService.getAllSettings().subscribe(
          (data) => this.settings = data
      );
    }, (reason) => {
      if (reason.message !== undefined) {
        this.toastService.showError( `An error occured when trying to save global settings : ${reason.message}`);
      }
    });
    modalRef.componentInstance.settings = settings;
  }

  disableSetting(globalSetting: GlobalSetting){
    this.globalSettingService.changeValue(globalSetting.key, 'false').subscribe(
      (result) => this.settings[this.settings.indexOf(globalSetting)] = result
    );
  }

  enableSetting(globalSetting: GlobalSetting){
    this.globalSettingService.changeValue(globalSetting.key, 'true').subscribe(
      (result) => this.settings[this.settings.indexOf(globalSetting)] = result
    );
  }

}
