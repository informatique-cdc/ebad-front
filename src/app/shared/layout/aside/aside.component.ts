import { Component } from '@angular/core';
import {UserService} from "../../../core/services";
import {Router} from "@angular/router";

@Component({
  selector: '[ebad-aside]',
  templateUrl: './aside.component.html'
})
export class AsideComponent {
  navbarUsageOpen = false;
  navbarManageOpen = false;
  navbarAdministrateOpen = false;

  constructor(private userService: UserService, private router: Router){}

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

  logout(){
    this.userService.purgeAuth();
    this.router.navigateByUrl('/login');
  }
}
