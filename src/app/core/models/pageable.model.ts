import {Sort} from './sort.model';

export class Pageable {
  offset: number;
  page: number;
  size: number;
  paged: boolean;
  sort: string;
  unpaged: boolean;

  constructor(pageNumber?: number, pageSize?: number){
    this.page = pageNumber;
    this.size = pageSize;
  }

}
