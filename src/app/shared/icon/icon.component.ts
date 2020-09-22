import {Component, Input} from "@angular/core";


@Component({
  selector: 'ebad-icon',
  template: '<svg-icon ngClass="icon-svg" src="./assets/img/icons/{{name}}.svg" applyClass="true" [class]="classname"></svg-icon>'
})
export class IconComponent {
  @Input() name: string;
  @Input() classname: string;
  constructor() { }
}
