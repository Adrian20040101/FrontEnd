import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { map } from 'rxjs';
import { Card } from '../card.model';
import { GalleryService } from '../gallery.service';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css'
})
export class AuthorsComponent implements OnInit {
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private galleryService = inject(GalleryService);

  get uniqueAuthors() {
    return this.galleryService.uniqueAuthors();
  }

  get selectedAuthor() {
    return this.galleryService.selectedAuthor();
  }
  
  ngOnInit() {
    const subscription = this.galleryService.fetchAuthorsAndCards()
      .subscribe({
        error: (error: Error) => {
          this.error.set(error.message);
        },
      })

      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      })
  }

  onAuthorChange(event: Event) {
    if (event.target instanceof HTMLSelectElement) {
      this.galleryService.selectedAuthor.set(event.target.value);
    }
  }
}
