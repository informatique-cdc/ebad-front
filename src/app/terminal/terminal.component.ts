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
                console.log(result);
            }
        });

        this.child.keyEventInput.subscribe(e => {
            console.log('keyboard event:' + e.domEvent.keyCode + ', ' + e.key);
            this.rxStompService.publish({destination: '/ebad/terminal2', body: e.key});

            const ev = e.domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) {
               // this.child.write('\n' + FunctionsUsingCSI.cursorColumn(1) + '$ '); // \r\n
            } else if (ev.keyCode === 8) {
                if (this.child.underlying.buffer.active.cursorX > 2) {
                 //   this.child.write('\b \b');
                }
            } else if (printable) {
                //this.child.write(e.key);
            }
        });
    }

    ngOnDestroy(): void {
        if (this.terminalSubscription) {
            this.terminalSubscription.unsubscribe();
        }
    }

}
