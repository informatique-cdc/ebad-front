import {Component, OnDestroy, OnInit} from '@angular/core';
import {AccreditationRequestsService, UserService} from "../../../core/services";
import {Router} from "@angular/router";
import {RxStompService} from "@stomp/ng2-stompjs";
import {Subscription} from "rxjs";
import {Pageable} from "../../../core/models/pageable.model";

@Component({
  selector: '[ebad-aside]',
  templateUrl: './aside.component.html'
})
export class AsideComponent implements OnInit, OnDestroy{
  navbarUsageOpen = false;
  navbarManageOpen = false;
  navbarAdministrateOpen = false;
  sub: Subscription;
  accreditationBadge = 0;
  constructor(private userService: UserService,
              private router: Router,
              private rxStompService: RxStompService,
              private accreditationService: AccreditationRequestsService){}

  ngOnInit() {
    this.accreditationService.getAllNeedAnswer(new Pageable(0,1)).subscribe(
      (request) => {
        this.accreditationBadge = request.totalElements;
        this.showBadgeAccreditations();
      }
    );
  }

  showBadgeAccreditations(){
    this.sub = this.rxStompService.watch('/user/queue/accreditations').subscribe({
      next: this.addAccreditation
    });
    this.sub = this.rxStompService.watch('/user/queue/accreditationsResponses').subscribe({
      next: this.removeAccreditation
    });
  }

  addAccreditation = receivedMsg => {
    this.accreditationBadge += 1;
  }

  removeAccreditation = receivedMsg => {
    this.accreditationBadge -= 1;
  }

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

  ngOnDestroy(): void {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }
}
