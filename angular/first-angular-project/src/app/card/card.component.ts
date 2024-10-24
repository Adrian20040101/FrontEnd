import { HttpClient } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Card } from '../card.model';
import { AuthorsService } from '../authors.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  cards = signal<Card[] | undefined>(undefined);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private authorsService = inject(AuthorsService);

  filteredCards = this.authorsService.getFilteredCards();

  ngOnInit() {
    const subscription = this.authorsService.fetchAuthorsAndCards()
      .subscribe({
        next: (cards) => {
          this.cards.set(cards);
        },
        error: (error: Error) => {
          this.error.set(error.message);
        },
      })

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
  }
}
