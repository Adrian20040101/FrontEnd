import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Card } from './card.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorsService {
  private httpClient = inject(HttpClient);
  uniqueAuthors = signal<string[] | undefined>(undefined);
  selectedAuthor = signal<string | undefined>(undefined);
  cards = signal<Card[] | undefined>(undefined);

  constructor() { }

  fetchAuthorsAndCards() {
    return this.httpClient
      .get<Card[]>('https://picsum.photos/v2/list')
      .pipe(
        map(response => {
          // placing the authors in a set to remove duplicates
          const authors = Array.from(new Set(response.map(item => item.author)));
          this.uniqueAuthors.set(authors);

          // here i set the selected author to initially be the first author in the dropdown
          if (authors.length > 0) {
            this.selectedAuthor.set(authors[0]);
          }

          this.cards.set(response);

          return response;
        })
      )
  }

  getFilteredCards() {
    return computed(() => {
      if (this.cards() && this.selectedAuthor()) {
        return this.cards()?.filter(card => card.author === this.selectedAuthor());
      }
      return this.cards();
    });
  }
}
