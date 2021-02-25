import {Pipe, PipeTransform} from '@angular/core';
import {User} from '../core';

@Pipe({name: 'avatar'})
export class AvatarPipe implements PipeTransform {
  transform(user: User): string {
    if (!user || !user.firstName || !user.lastName){
      return '?';
    }
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
}
