import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpTokenInterceptor} from './interceptors';

import {
    AccreditationRequestsService,
    ApiService,
    ApplicationsService,
    AuthGuard,
    BatchsService,
    ChainsService,
    EnvironmentsService,
    FilesService,
    GlobalSettingsService,
    JwtService,
    NewsService,
    NormsService,
    NotificationsService,
    ProfilesService,
    SelectChoicesService,
    StatisticsService,
    TagsService,
    UserService,
    UsersService
} from './services';
import {TracesService} from './services/traces.service';
import {FileKindsService} from './services/file-kinds.service';
import {RoleService} from './services/role.service';
import {SchedulingsService} from './services/schedulings.service';
import {SidebarService} from './services/sidebar.service';
import {InitConfigService} from './services/init-config.service';
import {InitAuthConfigService} from './services/init-oauth-config.service';
import {SseService} from './services/sse.service';
import {IdentitiesService} from './services/identities.service';
import {ApiTokensService} from './services/api-tokens.service';
import {TerminalsService} from './services/terminals.service';

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true},
        ApiService,
        ApplicationsService,
        AuthGuard,
        StatisticsService,
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
        NotificationsService,
        GlobalSettingsService,
        AccreditationRequestsService,
        SelectChoicesService,
        RoleService,
        SchedulingsService,
        SidebarService,
        InitConfigService,
        InitAuthConfigService,
        SseService,
        IdentitiesService,
        ApiTokensService,
        TerminalsService
    ],
    declarations: []
})
export class CoreModule {
}
