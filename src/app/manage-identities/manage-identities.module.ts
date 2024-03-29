import {NgModule} from '@angular/core';
import {ManageIdentitiesComponent} from './manage-identities.component';
import {ManageIdentitiesRoutingModule} from './manage-identities-routing.module';
import {SharedModule} from '../shared';
import {ModalIdentityComponent} from './modal-identity/modal-identity.component';
import {ModalIdentityDeletionComponent} from './modal-identity-deletion/modal-identity-deletion.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {NgxResize} from 'ngx-resize';


@NgModule({
    declarations: [ManageIdentitiesComponent, ModalIdentityComponent, ModalIdentityDeletionComponent],
    imports: [
        ManageIdentitiesRoutingModule,
        SharedModule,
        NgbPaginationModule,
        DataTablesModule,
        NgxResize,
    ]
})
export class ManageIdentitiesModule {
}
