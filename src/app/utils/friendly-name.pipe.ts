import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendlyName'
})
export class FriendlyNamePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/-/g, ' ').replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
  }
}