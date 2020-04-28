import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {GlobalSetting, GlobalSettingsService} from '../core';

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
  ) {

  }

  ngOnInit() {
    this.globalSettingService.getAllSettings().subscribe(
      (data) => this.settings = data
    )
  }

  disableSetting(globalSetting: GlobalSetting){
    this.globalSettingService.changeValue(globalSetting.key,'false').subscribe(
      (result) => this.settings[this.settings.indexOf(globalSetting)] = result
    );
  }

  enableSetting(globalSetting: GlobalSetting){
    this.globalSettingService.changeValue(globalSetting.key,'true').subscribe(
      (result) => this.settings[this.settings.indexOf(globalSetting)] = result
    );
  }

}
