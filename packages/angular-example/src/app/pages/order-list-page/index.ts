import { Atom } from '@borshch/utilities';
import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { RenderOrderList, UpdateOrderList, presentOrderList } from '@clean-architecture-playground/core';
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-list-page',
  imports: [CommonModule],
  templateUrl: './view.html',
  styleUrl: './view.css',
  standalone: true
})
export class OrderListPageComponent {
  
  #presentation = Atom.of({})
  viewModel = {} as any
  
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
  
  #renderOrderList = RenderOrderList({
    presentation: this.#presentation,
    updateOrderList: UpdateOrderList({
      presentation: this.#presentation,
      dataStore: dataStore(),
      notifier: notifier(),
    }),
  })
  
  #unsubscribeFromPresentation: any
}
