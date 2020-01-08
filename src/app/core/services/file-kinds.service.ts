import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {FileKind} from '../models/file-kind.model';
import {Pageable} from "../models/pageable.model";
import {Page} from "../models/page.model";

@Injectable()
export class FileKindsService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  getAllFromApplication(applicationId, pageable: any = new Pageable(0,20)): Observable<Page<FileKind>> {
    console.log(pageable);
    return this.apiService.get(`/typefichier/application/${applicationId}`,pageable);
  }

  addNaming(fileKinds: FileKind): Observable<FileKind> {
    return this.apiService.put(`/typefichier`, fileKinds);
  }

  deleteNaming(fileKinds: FileKind): Observable<FileKind> {
    return this.apiService.post(`/typefichier/delete`, fileKinds);
  }

  updateNaming(fileKinds: FileKind): Observable<FileKind> {
    return this.apiService.patch(`/typefichier`, fileKinds);
  }
}
