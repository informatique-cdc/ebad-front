import {Audit} from './audit.model';
import {Environment} from './environment.model';
import {ChainAssociation} from './chain-association.model';

export interface Chain extends Audit {
  id: number;
  name: string;
  description: string;
  environnement: Environment;
  chaineAssociations: ChainAssociation[];
}
