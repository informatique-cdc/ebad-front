import {NgModule} from '@angular/core';
import {AdminIdentitiesComponent} from './admin-identities.component';
import {AdminIdentitiesRoutingModule} from './admin-identities-routing.module';
import {SharedModule} from '../shared';
import {ModalIdentityComponent} from './modal-identity/modal-identity.component';
import {ModalIdentityDeletionComponent} from './modal-identity-deletion/modal-identity-deletion.component';
import {NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {DataTablesModule} from 'angular-datatables';
import {AngularResizeEventModule} from 'angular-resize-event';

@NgModule({
    declarations: [AdminIdentitiesComponent, ModalIdentityComponent, ModalIdentityDeletionComponent],
    imports: [
        AdminIdentitiesRoutingModule,
        SharedModule,
        NgbPaginationModule,
        DataTablesModule,
        AngularResizeEventModule
    ]
})
export class AdminIdentitiesModule {
}
