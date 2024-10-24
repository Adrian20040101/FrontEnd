import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { map } from 'rxjs';
import { Card } from '../card.model';
import { AuthorsService } from '../authors.service';

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
  private authorsService = inject(AuthorsService);

  get uniqueAuthors() {
    return this.authorsService.uniqueAuthors();
  }
  
  ngOnInit() {
    const subscription = this.authorsService.fetchAuthorsAndCards()
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
      this.authorsService.selectedAuthor.set(event.target.value);
    }
  }
}
