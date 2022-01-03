import {NgModule} from '@angular/core';

import {TerminalComponent} from './terminal.component';
import {SharedModule} from '../shared';
import {TerminalRoutingModule} from './terminal-routing.module';
import {NgTerminalModule} from 'ng-terminal';

@NgModule({
  imports: [
    SharedModule,
    TerminalRoutingModule,
    NgTerminalModule
  ],
  declarations: [
    TerminalComponent
  ]
})
export class TerminalModule {
}
