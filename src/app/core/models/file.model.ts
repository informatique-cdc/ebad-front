import {Directory} from './directory.model';

export interface File {
  directory: Directory;
  size: number;
  name: string;
  updateDate: Date;
  createDate: Date;
}
