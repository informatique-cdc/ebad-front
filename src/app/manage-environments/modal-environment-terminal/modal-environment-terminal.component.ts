import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Environment} from '../../core';
import {TerminalsService} from '../../core/services/terminals.service';
import {RxStompService} from '@stomp/ng2-stompjs';
import {NgTerminal} from 'ng-terminal';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-modal-environment',
    templateUrl: './modal-environment-terminal.component.html'
})
export class ModalEnvironmentTerminalComponent implements AfterViewInit, OnDestroy, OnInit {
    environment: Environment;
    @ViewChild('term', {static: true}) child: NgTerminal;

    private terminalSubscription: Subscription;
    private terminalId: string;

    constructor(public activeModal: NgbActiveModal,
                private terminalsService: TerminalsService,
                private rxStompService: RxStompService) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.terminalsService.get(this.environment.id).subscribe(terminal => {
            this.terminalId = terminal.id;
            this.terminalSubscription = this.rxStompService.watch('/user/queue/terminal-' + this.terminalId).subscribe({
                next: result => {
                    this.child.write(result.body);
                }
            });

            this.child.keyEventInput.subscribe(e => {
                this.rxStompService.publish({
                    destination: '/ebad/terminal',
                    body: JSON.stringify({id: this.terminalId, key: e.key})
                });
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
