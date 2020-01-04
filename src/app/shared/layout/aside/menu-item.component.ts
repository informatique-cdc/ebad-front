import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'ebad-menu-item',
  templateUrl: './menu-item.component.html'
})
export class MenuItemComponent implements OnInit{
  @Input() link: string;
  @Input() href: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() isParent: boolean;
  @Input() isOpen: boolean;
  classActive: string;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    if(!this.href && this.link) {
      this.classActive = 'active';
    }else{
      this.classActive = '';
    }
  }

  click(){
    if(this.isParent){
      return;
    }
    if(this.link){
      this.router.navigateByUrl(this.link);
    }

    if(this.href){
      window.location.href = this.href;
    }
  }

}
