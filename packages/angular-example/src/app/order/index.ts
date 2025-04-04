import { Component } from '@angular/core'
import { Atom } from '@borshch/utilities'
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies'
import { ChangeOrderField, CloseOrder, RenderOrder, SaveOrder } from '@clean-architecture-playground/core'
import { AngularNavigator } from '../dependencies/navigator'
import {presentOrder} from './presenter'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-order-page',
  standalone: false,
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderPage {
  constructor(navigator: AngularNavigator) {
    this.#navigator = navigator
    this.#useCases = {
      renderOrder: RenderOrder({
        dataStore,
        presentation: this.#presentation,
      }),
      closeOrder: CloseOrder({
        notifier,
        navigator: this.#navigator,
        presentation: this.#presentation,
      }),
      saveOrder: SaveOrder({
        dataStore, notifier,
        navigator: this.#navigator,
        presentation: this.#presentation,
      }),
      changeOrderField: ChangeOrderField({
        presentation: this.#presentation,
      }),
    }
  }

  viewModel = {} as any

  controller = {
    initialize: () => {
      this.#queryParamsSubscriber = this.#navigator.currentRoute.queryParams.subscribe(({id}) => {
        this.#useCases.renderOrder(id)
        this.#queryParamsSubscriber?.unsubscribe()
      })
    },
    change: (event: Event) => {
      const {target} = event
      const {name, value} = target as HTMLInputElement
      this.#useCases.changeOrderField(name, value)
    },
    save: () => this.#useCases.saveOrder(),
    close: () => this.#useCases.closeOrder(),
  }

  ngOnInit() {
    this.#unsubscribeFromPresentation = this.#presentation.subscribe((model: any) => {
      this.viewModel = presentOrder(model)
    })
    this.controller.initialize()
  }

  ngOnDestroy() {
    this.#unsubscribeFromPresentation()
    this.#queryParamsSubscriber.unsubscribe()
  }

  #useCases
  #navigator
  #presentation = new Atom()
  #queryParamsSubscriber!: Subscription
  #unsubscribeFromPresentation!: () => void
}
