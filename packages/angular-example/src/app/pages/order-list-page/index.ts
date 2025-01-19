import { Atom } from '@borshch/utilities';
import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { RenderOrderList, UpdateOrderList, OpenOrder, RemoveOrderFromList } from '@clean-architecture-playground/core';
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies';
import { Router } from '@angular/router';
import { AppNavigator } from '../../dependencies/navigator';
import {presentOrderList} from './presenter';

@Component({
  selector: 'app-order-list-page',
  standalone: false,
  
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderListPageComponent {
  
  #presentation = new Atom()
  viewModel = {} as any
  #navigator = new AppNavigator()
  
  constructor(private router: Router) {
  }
  
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
    return this.viewModel.loading && !this.viewModel.list?.length
      ? Array(3).fill(this.emptyOrderPresentation)
      : this.viewModel.list
  }
  
  openOrder(orderId: string) {
    if (orderId) {
      this.#openOrder(orderId)
    }
  }
  
  refresh() {
    this.#updateOrderList({ refresh: true })
  }
  
  loadMore() {
    this.#updateOrderList()
  }
  
  deleteOrder(event: any, orderId: string) {
    event.stopPropagation()
    this.#removeOrderFromList(orderId)
  }

  #renderOrderList = RenderOrderList({
    presentation: this.#presentation,
    updateOrderList: UpdateOrderList({
      presentation: this.#presentation,
      dataStore,
      notifier,
    }),
  })
  
  #openOrder = OpenOrder({
    presentation: this.#presentation,
    navigator: this.#navigator,
    notifier,
  })
  
  #updateOrderList = UpdateOrderList({
    dataStore,
    notifier,
    presentation: this.#presentation,
  })

  #removeOrderFromList = RemoveOrderFromList({
    dataStore, notifier,
    presentation: this.#presentation,
  })
  
  #unsubscribeFromPresentation: any
}
