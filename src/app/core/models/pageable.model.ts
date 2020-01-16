import {Sort} from './sort.model';

export class Pageable {
  offset: number;
  page: number;
  size: number;
  paged: boolean;
  sort: string;
  unpaged: boolean;
  


  constructor(pageNumber?: number, pageSize?: number, sort?: string){
    this.page = pageNumber;
    this.size = pageSize;
    if(sort) {
      this.sort = sort;
    }
  }


}
