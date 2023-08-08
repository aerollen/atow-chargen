import { Pipe, PipeTransform } from '@angular/core';
import { Book, Citation } from './common';

@Pipe({
  name: 'citation'
})
export class CitationPipe implements PipeTransform {

  transform(value: Citation): string {
    const book = Book[value.Book].replace(/([A-Z])/g, ' $1').replace(/([0-9]+)/g, '-$1').trim();

    return `${book}, pg: ${value.Page}`;
  }

}
