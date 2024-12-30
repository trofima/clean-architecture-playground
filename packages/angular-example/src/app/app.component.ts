import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OrderListPageComponent } from './pages/order-list-page';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    OrderListPageComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular';
}
