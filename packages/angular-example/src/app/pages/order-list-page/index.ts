import { Atom } from '@borshch/utilities';
import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { RenderOrderList, UpdateOrderList, presentOrderList, OpenOrder } from '@clean-architecture-playground/core';
import { DataStore, Notifier } from '@clean-architecture-playground/core/dummy-dependencies';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list-page',
  templateUrl: './view.html',
  styleUrls: ['./view.css'],
  standalone: false,
})
export class OrderListPageComponent {
  
  #presentation = Atom.of({})
  viewModel = {} as any
  #navigator = {
    open: (page: string, project: {id: string}) => {
      console.log('navigate to order', project.id)
      return this.router.navigate([page]);
    }
  }
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.#presentation.subscribe((model: any) => {
      this.viewModel = presentOrderList(model)
    })
    this.#renderOrderList()
  }

  ngOnDestroy() {
    this.#unsubscribeFromPresentation?.unsubscribe()
  }
  
  get emptyOrderPresentation() {
    return {createdDate: '...', user: {name: '...'}, sum: '...', paymentStatus: '...', fulfillmentStatus: '...',}
  }
  
  get orders() {
    return !this.viewModel.loading && this.viewModel.list?.length
      ? this.viewModel.list
      : Array(3).fill(this.emptyOrderPresentation)
  }
  
  openOrder(orderId: string) {
    if (orderId) {
      console.log('open order', orderId)
      this.#openOrder(orderId)
    }
  }
  
  #renderOrderList = RenderOrderList({
    presentation: this.#presentation,
    updateOrderList: UpdateOrderList({
      presentation: this.#presentation,
      dataStore: new DataStore(),
      notifier: new Notifier(),
    }),
  })
  
  #openOrder = OpenOrder({
    presentation: this.#presentation,
    navigator: this.#navigator,
  })
  
  #unsubscribeFromPresentation: any
}
