import {Component, Input} from "@angular/core";


@Component({
  selector: 'ebad-icon',
  template: '<svg-icon src="./assets/img/icons/{{name}}.svg" applyCss="true" class="icon-svg {{classname}}"></svg-icon>'
})
export class IconComponent {
  @Input() name: string;
  @Input() classname: string;
  constructor() { }
}
