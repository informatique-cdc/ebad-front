import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(message: string, type: string = 'standard') {
    this.toasts.push({ message, type });
  }

  showError(message: string) {
    this.show(message, 'error');
  }

  showSuccess(message: string) {
    this.show(message, 'success');
  }

  showInfo(message: string) {
    this.show(message, 'standard');
  }


  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
