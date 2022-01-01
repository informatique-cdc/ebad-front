import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {Terminal} from '../models/terminal.model';

@Injectable()
export class TerminalsService {
    constructor(
        private apiService: ApiService,
    ) { }

    get(environmentId): Observable<Terminal> {
        return this.apiService.get('/terminals/' + environmentId);
    }

}
