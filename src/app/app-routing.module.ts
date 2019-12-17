import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AuthGuard} from "./core/services";
import {NoAuthGuard} from "./auth/no-auth-guard.service";
import {AuthComponent} from "./auth/auth.component";


const routes: Routes = [
  {
    path: 'batchs',
    loadChildren: './batchs/batchs.module#BatchsModule'
  },
  {
    path: 'traces',
    loadChildren: './traces/traces.module#TracesModule'
  },
  {
    path: 'chains',
    loadChildren: './chains/chains.module#ChainsModule'
  },
  {
    path: 'files',
    loadChildren: './files/files.module#FilesModule'
  },
  {
    path: 'manage',
    children: [
      {
        path: 'batchs',
        loadChildren: './manage-batchs/manage-batchs.module#ManageBatchsModule'
      },
      {
        path: 'chains',
        loadChildren: './manage-chains/manage-chains.module#ManageChainsModule'
      },
      {
        path: 'directories',
        loadChildren: './manage-directories/manage-directories.module#ManageDirectoriesModule'
      },
      {
        path: 'naming',
        loadChildren: './manage-naming/manage-naming.module#ManageNamingModule'
      },
      {
        path: 'environments',
        loadChildren: './manage-environments/manage-environments.module#ManageEnvironmentsModule'
      }
      ]
  },
  {
    path: 'admin',
    children: [
      {
        path: 'users',
        loadChildren: './admin-users/admin-users.module#AdminUsersModule'
      },
      {
        path: 'applications',
        loadChildren: './admin-applications/admin-applications.module#AdminApplicationsModule'
      },
      {
        path: 'norms',
        loadChildren: './admin-norms/admin-norms.module#AdminNormsModule'
      },
      {
        path: 'news',
        loadChildren: './admin-news/admin-news.module#AdminNewsModule'
      }
    ]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
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
    initialNavigation: true
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
