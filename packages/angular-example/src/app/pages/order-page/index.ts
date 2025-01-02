import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-page',
  standalone: false,
  
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderPageComponent {
  @Input() id: string = ''

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Retrieve the route parameter and set it to the @Input property
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
    });
  }
}
