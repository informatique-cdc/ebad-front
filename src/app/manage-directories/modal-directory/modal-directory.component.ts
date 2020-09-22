import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Directory, Environment} from '../../core/models';
import {FilesService} from '../../core/services';

@Component({
  selector: 'app-modal-directory',
  templateUrl: './modal-directory.component.html',
})
export class ModalDirectoryComponent implements OnInit {
  environment: Environment;
  isUpdate = false;
  title = 'Ajouter un répertoire';
  action = 'Ajouter';

  directory: Directory;

  constructor(public activeModal: NgbActiveModal,
              private filesService: FilesService) {
    this.directory = {
      id: undefined,
      name: undefined,
      canWrite: false,
      path: undefined,
      environnement: this.environment,
      createdBy: undefined,
      createdDate: undefined,
      lastModifiedBy: undefined,
      lastModifiedDate: undefined,
    };
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier le répertoire ${this.directory.name}`;
      this.action = `Modifier`;
    }
  }

  addDirectory() {
    this.directory.environnement = this.environment;
    if (!this.isUpdate) {
      this.filesService.addDirectory(this.directory).subscribe(
        directory => {
          this.activeModal.close(directory);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.filesService.updateDirectory(this.directory).subscribe(
        directory => {
          this.activeModal.close(directory);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
