import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Directory, File} from '../models';
import {Page} from '../models/page.model';
import {Pageable} from '../models/pageable.model';

@Injectable()
export class FilesService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(envId, pageable: any = new Pageable(0, 20)): Observable<Page<Directory>> {
    return this.apiService.get(`/directories/env/${envId}`, pageable);
  }

  addDirectory(directory: Directory): Observable<Directory> {
    return this.apiService.put(`/directories`, directory);
  }

  updateDirectory(directory: Directory): Observable<Directory> {
    return this.apiService.patch(`/directories`, directory);
  }

  deleteDirectory(directory: Directory): Observable<void> {
    return this.apiService.post(`/directories/delete`, directory);
  }

  getAllFilesFromDirectory(slug, subDir?: string): Observable<File[]> {
    let param;
    if (subDir && subDir !== ''){
      param = {subDirectory: subDir};
    }
    return this.apiService.get(`/directories/files/${slug}`, param);
  }

  deleteFile(file): Observable<void> {
    return this.apiService.post(`/directories/files/delete`, file);
  }

  downloadFile(file): Observable<ArrayBuffer> {
    return this.apiService.postFile(`/directories/files/read`, file, {responseType: 'arraybuffer', headers: {'Content-Type': 'application/json'}});
  }

  uploadFile(file, name, idDirectory, subDirectory?): Observable<any> {
    const formData = new FormData();
    formData.append('directory', idDirectory);
    formData.append('file', file, name);
    if (subDirectory) {
      formData.append('subDirectory', subDirectory);
    }
    return this.apiService.postFile(`/directories/files/upload`, formData, {});
  }
}
