import {Component, TemplateRef} from '@angular/core';
import {ToastService} from "../../core/services/toast.service";

@Component({
  selector: 'ebad-toasts',
  // template: '',
  templateUrl: 'toast.component.html',
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }
}
