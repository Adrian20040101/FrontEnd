import { Component, ElementRef, HostBinding, HostListener, inject, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'control',
    '(click)': 'onClick()'
  }
})
export class ControlComponent {
  @Input({ required: true }) title!: string;
  private el = inject(ElementRef);

  // this is another way of setting host binding but adding it to the Component Decorator as above is the preferred method
  //@HostBinding('class') className = 'control';

  // alternatively, it is possible to also bind functions using HostListener
  // @HostListener('click') onClick() {
  //   console.log('CLicked');
  // }

  onClick() {
      console.log('Clicked');
      console.log(this.el);
  }

}
