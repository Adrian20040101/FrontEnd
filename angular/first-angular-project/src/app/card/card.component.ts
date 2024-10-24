import { HttpClient } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Card } from '../card.model';
import { GalleryService } from '../gallery.service';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  cards = signal<Card[] | undefined>(undefined);
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private galleryService = inject(GalleryService);
  filteredCards = this.galleryService.getFilteredCards();
  

  ngOnInit() {
    const subscription = this.galleryService.fetchAuthorsAndCards()
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
