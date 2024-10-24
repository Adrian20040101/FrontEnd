import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() totalPages: number = 1;
  @Input() currentPage = signal<number>(1);
  @Output() pageChange = new EventEmitter<number>();

  previousPage() {
    if (this.currentPage() > 1) {
      this.pageChange.emit(this.currentPage() - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages) {
      this.pageChange.emit(this.currentPage() + 1);
    }
  }
}
