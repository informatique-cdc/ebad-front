import { Component } from '@angular/core';

@Component({
  selector: '[ebad-aside]',
  templateUrl: './aside.component.html'
})
export class AsideComponent {
  navbarUsageOpen = false;
  navbarManageOpen = false;
  navbarAdministrateOpen = false;

  toggleUsage() {
    this.navbarUsageOpen = !this.navbarUsageOpen;
    if(this.navbarUsageOpen){
      this.navbarManageOpen = false;
      this.navbarAdministrateOpen = false;
    }
  }

  toggleManage() {
    this.navbarManageOpen = !this.navbarManageOpen;
    if(this.navbarManageOpen){
      this.navbarUsageOpen = false;
      this.navbarAdministrateOpen = false;
    }
  }

  toggleAdministrate() {
    this.navbarAdministrateOpen = !this.navbarAdministrateOpen;
    if(this.navbarAdministrateOpen) {
      this.navbarUsageOpen = false;
      this.navbarManageOpen = false;
    }
  }
}
