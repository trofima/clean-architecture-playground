import { Atom } from '@borshch/utilities';
import { Component } from '@angular/core';
import { RenderOrderList, UpdateOrderList, OpenOrder, RemoveOrderFromList } from '@clean-architecture-playground/core';
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies';
import { AppNavigator } from '../../dependencies/navigator';
import {presentOrderList} from './presenter';

@Component({
  selector: 'app-order-list-page',
  standalone: false,
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderListPageComponent {
  ngOnInit(): void {
    this.#unsubscribeFromPresentation = this.#presentation.subscribe((model: any) => {
      this.viewModel = presentOrderList(model)
    })
    this.controller.initialize()
  }

  ngOnDestroy() {
    this.#unsubscribeFromPresentation()
  }

  viewModel = {} as any

  get orders() { // TODO: ivanko - move to presenter and test it
    return this.viewModel.loading && !this.viewModel.list?.length
      ? Array(3).fill(emptyOrderPresentation)
      : this.viewModel.list
  }
  
  #presentation = new Atom()
  #navigator = new AppNavigator()

  #useCases = {
    renderOrderList: RenderOrderList({
      presentation: this.#presentation,
      updateOrderList: UpdateOrderList({
        presentation: this.#presentation,
        dataStore,
        notifier,
      }),
    }),
    updateOrderList: UpdateOrderList({
      presentation: this.#presentation,
      dataStore,
      notifier,
    }),
    removeOrderFromList: RemoveOrderFromList({
      presentation: this.#presentation,
      dataStore,
      notifier,
    }),
    openOrder: OpenOrder({
      presentation: this.#presentation,
      navigator: this.#navigator,
      notifier,
    }),
  }

  controller = {
    initialize: () => this.#useCases.renderOrderList(),
    openOrder: this.#useCases.openOrder,
    refresh: () => this.#useCases.updateOrderList({ refresh: true }),
    loadMore: () => this.#useCases.updateOrderList(),
    deleteOrder: (event: any, orderId: string) => {
      event.stopPropagation()
      this.#useCases.removeOrderFromList(orderId)
    },
  }
  
  #unsubscribeFromPresentation: any
}

const emptyOrderPresentation = {createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...'}
