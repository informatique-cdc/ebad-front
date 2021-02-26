import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({name: 'yesno'})
export class YesNoPipe implements PipeTransform {
  constructor(private translate: TranslateService){}
  transform(condition: boolean): string {
    return this.translate.instant((condition ? 'YES' : 'NO'));
  }
}
