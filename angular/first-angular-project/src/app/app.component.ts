import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorsComponent } from "./authors/authors.component";
import { CardComponent } from "./card/card.component";
import { PaginationComponent } from './pagination/pagination.component';
import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthorsComponent, CardComponent, PaginationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'first-angular-project';
  private galleryService = inject(GalleryService);
  selectedAuthor = this.galleryService.selectedAuthor();
  totalPages = this.galleryService.getTotalPages();
  currentPage = signal<number>(1);

  onPageChange(page: number) {
    this.currentPage.set(page);
    this.galleryService.setCurrentPage(page);
  }
}
