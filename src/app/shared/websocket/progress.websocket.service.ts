import { Injectable } from '@angular/core';
import {InjectableRxStompConfig, RxStompService, StompConfig} from '@stomp/ng2-stompjs';
import {WebSocketService} from "./websocket.service";
import {WebSocketOptions} from "./websocket.options";

export const progressStompConfig: InjectableRxStompConfig = {
  webSocketFactory: () => {
    return new WebSocket('ws://localhost:11006/ebad/secured/chat');
  }
};

@Injectable()
export class ProgressWebsocketService extends WebSocketService {
  constructor(stompService: RxStompService) {
    super(stompService, progressStompConfig, new WebSocketOptions('/secured/chat'));
  }
}
