import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FunctionsUsingCSI, NgTerminal} from 'ng-terminal';
import {Subscription} from 'rxjs';
import {RxStompService} from '@stomp/ng2-stompjs';

@Component({
    selector: 'terminal-page',
    templateUrl: './terminal.component.html',
    styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit, OnDestroy {
    @ViewChild('term', {static: true}) child: NgTerminal;

    private terminalSubscription: Subscription;

    constructor(public translateServier: TranslateService,
                private rxStompService: RxStompService) {

    }

    ngAfterViewInit() {
        this.terminalSubscription = this.rxStompService.watch('/user/queue/terminal1').subscribe({
            next: result => {
                this.child.write(result.body);
            }
        });

        this.child.keyEventInput.subscribe(e => {
            this.rxStompService.publish({destination: '/ebad/terminal2', body: e.key});
        });
    }

    ngOnDestroy(): void {
        if (this.terminalSubscription) {
            this.terminalSubscription.unsubscribe();
        }
    }

}
