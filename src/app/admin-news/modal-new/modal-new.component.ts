import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NewsService, New} from '../../core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-modal-new',
  templateUrl: './modal-new.component.html'
})
export class ModalNewComponent implements OnInit {
  public Editor = ClassicEditor;

  isUpdate = false;
  thisTitle = 'Ajouter une actualité';
  action = 'Ajouter';
  oneNew: New = {
    id: undefined,
    title: undefined,
    content: '',
    draft: true,
    createdBy: undefined,
    createdDate: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined
  };

  constructor(public activeModal: NgbActiveModal,
              private newsService: NewsService) {
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.thisTitle = `Modifier l'actualité ${this.oneNew.title}`;
      this.action = `Modifier`;
    }
  }

  addNew() {
    if (!this.isUpdate) {
      this.newsService.addNew(this.oneNew).subscribe(
        () => {
          this.activeModal.close();
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.newsService.updateNew(this.oneNew).subscribe(
        norm => {
          this.activeModal.close(norm);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
