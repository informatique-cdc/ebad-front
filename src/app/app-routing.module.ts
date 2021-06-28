import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AuthGuard} from './core';
import {NoAuthGuard} from './auth/no-auth-guard.service';
import {AuthComponent} from './auth/auth.component';
import {SynthesisAccreditationRequestComponent} from './accreditation-requests/synthesis-accreditation-request.component';


const routes: Routes = [
  {
    path: 'batchs',
    loadChildren: () => import('./batchs/batchs.module').then(m => m.BatchsModule)
  },
  {
    path: 'schedulings',
    loadChildren: () => import('./schedulings/schedulings.module').then(m => m.SchedulingsModule)
  },
  {
    path: 'traces',
    loadChildren: () => import('./traces/traces.module').then(m => m.TracesModule)
  },
  {
    path: 'chains',
    loadChildren: () => import('./chains/chains.module').then(m => m.ChainsModule)
  },
  {
    path: 'files',
    loadChildren: () => import('./files/files.module').then(m => m.FilesModule)
  },
  {
    path: 'manage',
    children: [
      {
        path: 'batchs',
        loadChildren: () => import('./manage-batchs/manage-batchs.module').then(m => m.ManageBatchsModule)
      },
      {
        path: 'chains',
        loadChildren: () => import('./manage-chains/manage-chains.module').then(m => m.ManageChainsModule)
      },
      {
        path: 'directories',
        loadChildren: () => import('./manage-directories/manage-directories.module').then(m => m.ManageDirectoriesModule)
      },
      {
        path: 'naming',
        loadChildren: () => import('./manage-naming/manage-naming.module').then(m => m.ManageNamingModule)
      },
      {
        path: 'environments',
        loadChildren: () => import('./manage-environments/manage-environments.module').then(m => m.ManageEnvironmentsModule)
      },
      {
        path: 'access-control',
        loadChildren: () => import('./manage-access-control/manage-access-control.module').then(m => m.ManageAccessControlModule)
      },
      {
        path: 'identities',
        loadChildren: () => import('./manage-identities/manage-identities.module').then(m => m.ManageIdentitiesModule)
      }
      ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        loadChildren: () => import('./admin-users/admin-users.module').then(m => m.AdminUsersModule)
      },
      {
        path: 'applications',
        loadChildren: () => import('./admin-applications/admin-applications.module').then(m => m.AdminApplicationsModule)
      },
      {
        path: 'norms',
        loadChildren: () => import('./admin-norms/admin-norms.module').then(m => m.AdminNormsModule)
      },
      {
        path: 'news',
        loadChildren: () => import('./admin-news/admin-news.module').then(m => m.AdminNewsModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('./admin-settings/admin-settings.module').then(m => m.AdminSettingsModule)
      },
      {
        path: 'identities',
        loadChildren: () => import('./admin-identities/admin-identities.module').then(m => m.AdminIdentitiesModule)
      }
    ]
  },
  {
    path: 'user',
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      }
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'accreditations',
    component: SynthesisAccreditationRequestComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () => import('./loading/loading.module').then(m => m.LoadingModule)
  },
  {
    path: 'oauth',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // preload all modules; optionally we could
    // implement a custom preloading strategy for just some
    // of the modules (PRs welcome 😉)
    preloadingStrategy: PreloadAllModules,
    useHash: true,
    initialNavigation: 'enabledNonBlocking',
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
