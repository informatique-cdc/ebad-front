import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { NgTerminal} from 'ng-terminal';
import {Subscription} from 'rxjs';
import {RxStompService} from '@stomp/ng2-stompjs';
import {TerminalsService} from '../core/services/terminals.service';

@Component({
    selector: 'terminal-page',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit, OnDestroy, OnInit {
    @ViewChild('term', {static: true}) child: NgTerminal;

    private terminalSubscription: Subscription;
    private terminalId: string;
    constructor(public translateServier: TranslateService,
                private terminalsService: TerminalsService,
                private rxStompService: RxStompService) {

    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.terminalsService.get(27).subscribe(terminal => {
            this.terminalId = terminal.id;
            this.terminalSubscription = this.rxStompService.watch('/user/queue/terminal-' + this.terminalId).subscribe({
                next: result => {
                    this.child.write(result.body);
                }
            });

            this.child.keyEventInput.subscribe(e => {
                this.rxStompService.publish({destination: '/ebad/terminal', body: JSON.stringify({id: this.terminalId, key: e.key})});
            });
        }, error => {
            console.log(error);
        });
    }

    ngOnDestroy(): void {
        if (this.terminalSubscription) {
            this.terminalSubscription.unsubscribe();
        }
    }

}
