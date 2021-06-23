import {Audit} from './audit.model';

export interface Identity extends Audit {
  id: number;
  name: string;
  login: string;
  password: string;
  privatekey: string;
  privatekey_path: string;
  passphrase: string;
}
