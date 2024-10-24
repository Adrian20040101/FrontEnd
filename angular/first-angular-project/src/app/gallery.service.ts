import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Card } from './card.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private httpClient = inject(HttpClient);
  uniqueAuthors = signal<string[] | undefined>(undefined);
  selectedAuthor = signal<string | undefined>(undefined);
  cards = signal<Card[] | undefined>(undefined);
  itemsPerPage = 4;
  currentPage = signal<number>(1);

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
      const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      if (this.cards() && this.selectedAuthor()) {
        return this.cards()?.filter(card => card.author === this.selectedAuthor()).slice(startIndex, endIndex);
      }
      return this.cards()?.slice(startIndex, endIndex);
    });
  }

  getTotalPages() {
    return computed(() => {
      if (!this.cards()) return 1;
      const filteredCards = this.cards()?.filter(
        (card) => card.author === this.selectedAuthor()
      );
      // makes sure that there is at least one image card
      return Math.ceil(filteredCards!.length / this.itemsPerPage);
    });
  }

  setCurrentPage(page: number) {
    this.currentPage.set(page);
  }
}
