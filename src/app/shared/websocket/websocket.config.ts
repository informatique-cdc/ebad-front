import {InjectableRxStompConfig} from "@stomp/ng2-stompjs";
import {Injectable} from "@angular/core";
import {JwtService} from "../../core";
import * as SockJS from "sockjs-client";

@Injectable()
export class WebsocketConfig extends InjectableRxStompConfig {
  public brokerURL = 'ws://localhost:11006/ebad/ws';
  public connectHeaders;
  public heartbeatIncoming = 0; // Typical value 0 - disabled
  public heartbeatOutgoing = 20000; // Typical value 20000 - every 20 seconds
  public reconnectDelay = 20000;

  constructor(private jwtService: JwtService) {
    super();
    this.connectHeaders = {"Authorization": this.jwtService.getToken()}
    this.debug = (msg: string) => {
      console.log(new Date(), msg)
    }
  }
}
