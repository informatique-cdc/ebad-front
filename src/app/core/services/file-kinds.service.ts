import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {FileKind} from '../models/file-kind.model';

@Injectable()
export class FileKindsService {
  constructor(
    private apiService: ApiService,
  ) {
  }

  getAllFromApplication(applicationId): Observable<FileKind[]> {
    return this.apiService.get(`/typefichier/application/` + applicationId);
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
