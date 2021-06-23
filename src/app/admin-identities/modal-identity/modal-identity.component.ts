import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {IdentitiesService} from '../../core/services/identities.service';
import {Identity} from '../../core/models/identity.model';

@Component({
  selector: 'app-modal-identity',
  templateUrl: './modal-identity.component.html'
})
export class ModalIdentityComponent implements OnInit {
  isUpdate = false;
  title = 'Ajouter une identié';
  action = 'Ajouter';
  identity: Identity = {
    id: undefined,
    name: undefined,
    login: undefined,
    passphrase: undefined,
    password: undefined,
    privatekey: undefined,
    privatekey_path: undefined,
    createdBy: undefined,
    createdDate: undefined,
    lastModifiedBy: undefined,
    lastModifiedDate: undefined
  };

  constructor(public activeModal: NgbActiveModal,
              private identitiesService: IdentitiesService) {
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier l'identité ${this.identity.name}`;
      this.action = `Modifier`;
    }
  }

  addIdentity() {
    if (!this.isUpdate) {
      this.identitiesService.addIdentity(this.identity).subscribe(
        () => {
          this.activeModal.close();
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.identitiesService.updateIdentity(this.identity).subscribe(
          identity => {
          this.activeModal.close(identity);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
