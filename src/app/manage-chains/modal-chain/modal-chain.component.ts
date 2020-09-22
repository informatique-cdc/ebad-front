import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BatchsService, ChainsService} from '../../core/services';
import {Batch, Chain, ChainAssociation, Environment} from '../../core/models';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {NgModel} from '@angular/forms';
import {Pageable} from "../../core/models/pageable.model";

@Component({
  selector: 'app-modal-chain',
  templateUrl: './modal-chain.component.html',
  styleUrls: ['./modal-chain.component.scss']
})
export class ModalChainComponent implements OnInit {
  environment: Environment;
  isUpdate = false;
  title = 'Ajouter une chaine';
  action = 'Ajouter';
  batchs: Batch[] = [];
  tempBatchAssociation: Batch[] = [];
  tmpBatch: Batch = null;
  @ViewChild('selectBatch', {static: true}) private selectBatch: NgModel;

  chain: Chain;

  constructor(public activeModal: NgbActiveModal,
              private chainsService: ChainsService,
              private batchsService: BatchsService) {
    this.chain = {
      id: undefined,
      name: undefined,
      description: undefined,
      chaineAssociations: undefined,
      environnement: this.environment,
      createdBy: undefined,
      createdDate: undefined,
      lastModifiedBy: undefined,
      lastModifiedDate: undefined,
    };
  }

  ngOnInit() {
    if (this.isUpdate) {
      this.title = `Modifier la chaine ${this.chain.name}`;
      this.action = `Modifier`;

      const chainAssociationsSorted: ChainAssociation[] = this.chain.chaineAssociations.sort((n1, n2) => {
        if (n1.batchOrder > n2.batchOrder) {
          return 1;
        }

        if (n1.batchOrder < n2.batchOrder) {
          return -1;
        }

        return 0;
      });

      for (const chainAssociation of chainAssociationsSorted) {
        this.tempBatchAssociation.push(chainAssociation.batch);
      }
    }

    this.batchsService.getAllFromEnvironment(this.environment.id, new Pageable(0, 1000)).subscribe(
      batchs => {
        this.batchs = batchs.content;
      }
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tempBatchAssociation, event.previousIndex, event.currentIndex);
  }

  onSelectBatch(event) {
    if (event === null) {
      return;
    }
    this.tempBatchAssociation.push(event);
    this.selectBatch.reset(null);
  }

  removeBatch(batch) {
    this.tempBatchAssociation.splice(this.tempBatchAssociation.indexOf(batch), 1);
  }

  addChain() {
    let index = 0;
    this.chain.chaineAssociations = [];
    this.chain.environnement = this.environment;
    for (const batch of this.tempBatchAssociation) {
      const chainAssociation: ChainAssociation = {batch, batchOrder: index};
      this.chain.chaineAssociations.push(chainAssociation);
      index++;
    }

    if (!this.isUpdate) {
      this.chainsService.createChain(this.chain).subscribe(
        chain => {
          this.activeModal.close(chain);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    } else {
      this.chainsService.updateChain(this.chain).subscribe(
        batch => {
          this.activeModal.close(this.chain);
        },
        error => {
          this.activeModal.dismiss(error);
        }
      );
    }
  }
}
