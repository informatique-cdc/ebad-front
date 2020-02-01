import {Injectable} from '@angular/core';
import {Application, Environment} from "../models";

@Injectable()
export class NavigationService {
  private application: Application;
  private environment: Environment;

  constructor() {}

}
