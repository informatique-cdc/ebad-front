import {Audit} from './audit.model';

export interface Identity extends Audit {
  id: number;
  name: string;
  login: string;
  password: string;
  privatekey: string;
  privatekeyPath: string;
  passphrase: string;
}
