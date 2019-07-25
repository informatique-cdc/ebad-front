import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Directory} from '../models';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FilesService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getAllFromEnvironment(slug): Observable<Directory[]> {
    return this.apiService.get(`/directories/env/` + slug);
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

  getAllFilesFromDirectory(slug): Observable<File[]> {
    return this.apiService.get(`/directories/files/${slug}`);
  }

  deleteFile(file): Observable<void> {
    return this.apiService.post(`/directories/files/delete`, file);
  }

  downloadFile(file): Observable<ArrayBuffer> {
    return this.apiService.postFile(`/directories/files/read`, file, {responseType: 'arraybuffer'});
  }

  uploadFile(file, name, idDirectory): Observable<any> {
    const formData = new FormData();
    formData.append('directory', idDirectory);
    formData.append('file', file, name);
    return this.apiService.postFile(`/directories/files/upload`, formData);
  }
}
