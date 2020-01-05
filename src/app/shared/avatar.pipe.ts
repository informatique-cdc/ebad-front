import { Pipe, PipeTransform } from '@angular/core';
import {User} from "../core/models";

@Pipe({name: 'avatar'})
export class AvatarPipe implements PipeTransform {
  transform(user: User): string {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
}
