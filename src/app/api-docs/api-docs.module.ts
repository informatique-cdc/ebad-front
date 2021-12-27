import {NgModule} from '@angular/core';

import {ApiDocsComponent} from './api-docs.component';
import {SharedModule} from '../shared';
import {ApiDocsRoutingModule} from './api-docs-routing.module';

@NgModule({
  imports: [
    SharedModule,
    ApiDocsRoutingModule
  ],
  declarations: [
    ApiDocsComponent
  ]
})
export class ApiDocsModule {
}
