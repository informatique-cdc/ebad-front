import {Component, Input} from '@angular/core';

@Component({
  selector: 'ebad-menu-item',
  templateUrl: './menu-item.component.html'
})
export class MenuItemComponent {
  @Input() link: string;
  @Input() label: string;
  @Input() icon: string;
  @Input() isParent: boolean;
  @Input() isOpen: boolean;
}
