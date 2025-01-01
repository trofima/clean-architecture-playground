import { Atom } from '@borshch/utilities';
import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { RenderOrderList, UpdateOrderList, presentOrderList, OpenOrder } from '@clean-architecture-playground/core';
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies';
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
    open: (path: string) => {
      console.log('navigate to order', path)
      return this.router.navigate([path]);
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
    return {createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...'}
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
      dataStore: dataStore(),
      notifier: notifier(),
    }),
  })
  
  #openOrder = OpenOrder({
    presentation: this.#presentation,
    navigator: this.#navigator,
  })
  
  #unsubscribeFromPresentation: any
}
