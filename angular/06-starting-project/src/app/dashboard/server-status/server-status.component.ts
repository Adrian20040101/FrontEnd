import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css'
})
export class ServerStatusComponent implements OnInit {
  currentStatus: 'offline' | 'online' | 'unknown' = 'offline';
  private interval?: ReturnType<typeof setInterval>;
  private destroyRef = inject(DestroyRef);
  constructor() {}

  // with ngOnInit the app runs once after all components input initialization
  ngOnInit() {
    setInterval(() => {
      console.log('On View Init');
      const rand = Math.random();

      if (rand < 0.5) {
        this.currentStatus = 'online';
      } else if (rand < 0.9) {
        this.currentStatus = 'offline';
      } else {
        this.currentStatus = 'unknown';
      }
    }, 5000)

    this.destroyRef.onDestroy(() => {
      clearInterval(this.interval);
    }) 
  }

  ngAfterViewInit() {
    console.log('After View Init');
  }

  // used in older versions of angular
  //ngOnDestroy() {
  //  clearTimeout(this.interval);
  //}

}
