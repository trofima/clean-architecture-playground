import { Component } from '@angular/core'
import { Atom } from '@borshch/utilities'
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies'
import { ChangeOrderField, CloseOrder, RenderOrder, SaveOrder } from '@clean-architecture-playground/core'
import { AngularNavigator } from '../../dependencies/navigator'
import {presentOrder} from './presenter'
import {Subscription} from 'rxjs'

@Component({
  selector: 'app-order-page',
  standalone: false,
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderPageComponent {
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

  viewModel: ViewModel = {
    loading: false,
    hasChanges: false,
    data: {
      id: '',
      createdDate: '',
      updatedDate: '',
      user: {id: '', name: '', billingAddress: ''},
      sum: 0,
      paymentStatus: '',
      fulfillmentStatus: '',
      shippingAddress: '',
    },
    error:{
      message: '',
      code: '',
    },
  }

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
    console.log('OrderPageComponent ngOnInit')
    this.#unsubscribeFromPresentation = this.#presentation.subscribe((model: any) => {
      this.viewModel = presentOrder(model)
    })
    this.controller.initialize()
  }

  ngOnDestroy() {
    this.#unsubscribeFromPresentation()
    this.#queryParamsSubscriber.unsubscribe()
  }

  get dataIsEmpty() {
    return Boolean(Object.keys(this.viewModel.data).length)
  }
  
  #useCases
  #navigator
  #presentation = new Atom()
  #queryParamsSubscriber!: Subscription
  #unsubscribeFromPresentation!: () => void
}

type User = {id: string; name: string; billingAddress: string;}
type Error = {message: string; code: string;}
type OrderData = {
  id: string
  createdDate: string
  updatedDate: string
  user: User
  sum: number
  paymentStatus: string
  fulfillmentStatus: string
  shippingAddress: string
}

type ViewModel = {
  loading: boolean
  error: Error
  data: OrderData
  hasChanges: boolean
}
