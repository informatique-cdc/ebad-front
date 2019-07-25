import {Audit} from './audit.model';

export interface New extends Audit {
  id: number;
  title: string;
  content: string;
  draft: boolean;
}
