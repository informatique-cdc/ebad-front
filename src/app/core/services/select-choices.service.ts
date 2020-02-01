import { Injectable } from '@angular/core';
import {Application, Environment} from "../models";


@Injectable()
export class SelectChoicesService {

  selectApp(application: Application){
    if(!application){
      window.localStorage.removeItem('applicationSelected');
      return;
    }
    window.localStorage.setItem('applicationSelected', application.id+'');
  }

  getSelectedApp(): string{
    return window.localStorage.getItem('applicationSelected');
  }

  selectEnv(environment: Environment){
    if(!environment){
      window.localStorage.removeItem('environmentSelected');
      return;
    }
    window.localStorage.setItem('environmentSelected', environment.id+'');
  }

  getSelectedEnv(): string{
    return window.localStorage.getItem('environmentSelected');
  }

}
