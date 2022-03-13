import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';


@Injectable()
export class SidebarService {
  isSidebarVisible = true;

  sidebarVisibilityChange: Subject<boolean> = new Subject<boolean>();

  constructor()  {
    this.sidebarVisibilityChange.subscribe((value) => {
      this.isSidebarVisible = value;
    });
  }

  toggleSidebarVisibility() {
    this.sidebarVisibilityChange.next(!this.isSidebarVisible);
  }
}
