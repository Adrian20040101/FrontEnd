import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthorsComponent } from "./authors/authors.component";
import { CardComponent } from "./card/card.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuthorsComponent, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'first-angular-project';
}
