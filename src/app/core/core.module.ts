import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors';

import {
  ApiService,
  ApplicationsService,
  AuthGuard, BatchsService, ChainsService,
  CommentsService, EnvironmentsService, FilesService,
  JwtService, NewsService, NormsService, NotificationsService,
  ProfilesService,
  TagsService,
  UserService, UsersService
} from './services';
import {TracesService} from './services/traces.service';
import {FileKindsService} from './services/file-kinds.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    ApplicationsService,
    AuthGuard,
    CommentsService,
    JwtService,
    ProfilesService,
    TagsService,
    UserService,
    EnvironmentsService,
    BatchsService,
    TracesService,
    ChainsService,
    FilesService,
    FileKindsService,
    NormsService,
    UsersService,
    NewsService,
    NotificationsService
  ],
  declarations: []
})
export class CoreModule { }
