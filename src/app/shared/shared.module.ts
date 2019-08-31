import {CommonModule, DatePipe} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

import {ListErrorsComponent} from './list-errors.component';
import {ShowAuthedDirective} from './show-authed.directive';
import {TableComponent} from './table';
import {IconsModule} from '../icons';
import {HeadSelectorComponent} from './head-selector';
import {ActualityBlockComponent} from './actuality-block';
import {EnvAppHeadSelectorComponent} from './env-app-head-selector';
import {DateTraitementComponent} from './date-traitement';
import {ModalDateTraitementComponent} from './date-traitement/modal-date-traitement';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateFRParserFormatter} from './ngb-date-fr-parser-formatter';
import {Constants} from './Constants';
import {HasRoleDirective} from "./has-role/has-role.directive";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    RouterModule,
    IconsModule,
    NgbModule
  ],
  declarations: [
    ListErrorsComponent,
    ShowAuthedDirective,
    TableComponent,
    HeadSelectorComponent,
    ActualityBlockComponent,
    EnvAppHeadSelectorComponent,
    DateTraitementComponent,
    ModalDateTraitementComponent,
    HasRoleDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ListErrorsComponent,
    RouterModule,
    ShowAuthedDirective,
    TableComponent,
    HeadSelectorComponent,
    ActualityBlockComponent,
    EnvAppHeadSelectorComponent,
    DateTraitementComponent,
    HasRoleDirective
  ],
  entryComponents: [
    ModalDateTraitementComponent
  ],
  providers: [
    DatePipe,
    {provide: NgbDateParserFormatter, useClass: NgbDateFRParserFormatter},
    Constants
  ]
})
export class SharedModule {
}
