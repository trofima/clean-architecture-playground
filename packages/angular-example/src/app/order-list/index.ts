import { Atom } from '@borshch/utilities';
import { Component } from '@angular/core';
import { RenderOrderList, UpdateOrderList, OpenOrder, RemoveOrderFromList } from '@clean-architecture-playground/core';
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies';
import { AngularNavigator } from '../dependencies/navigator';
import {presentOrderList} from './presenter';

@Component({
  selector: 'app-order-list-page',
  standalone: false,
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderListPage {
  constructor(navigator: AngularNavigator) {
    this.#navigator = navigator
    this.#useCases = {
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
  }

  ngOnInit() {
    this.#unsubscribeFromPresentation = this.#presentation.subscribe((model: any) => {
      this.viewModel = presentOrderList(model)
    })
    this.controller.initialize()
  }

  ngOnDestroy() {
    this.#unsubscribeFromPresentation()
  }

  viewModel = {} as any
  #presentation = new Atom()
  #navigator
  #useCases

  controller = {
    initialize: () => this.#useCases.renderOrderList(),
    openOrder: (id: string) => this.#useCases.openOrder(id),
    refresh: () => this.#useCases.updateOrderList({ refresh: true }),
    loadMore: () => this.#useCases.updateOrderList(),
    deleteOrder: (event: MouseEvent, orderId: string) => {
      event.stopPropagation()
      this.#useCases.removeOrderFromList(orderId)
    },
  }
  
  #unsubscribeFromPresentation: any
}
