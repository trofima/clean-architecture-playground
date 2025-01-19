import { Component, ElementRef, inject, Input } from '@angular/core'
import { ActivatedRoute, provideRouter, Router } from '@angular/router'
import { Atom } from '@borshch/utilities'
import { dataStore, notifier } from '@clean-architecture-playground/core/dummy-dependencies'
import { ChangeOrderField, CloseOrder, RenderOrder, SaveOrder } from '@clean-architecture-playground/core'
import { AppNavigator } from '../../dependencies/navigator'
import {presentOrder} from './presenter'

@Component({
  selector: 'app-order-page',
  standalone: false,
  
  templateUrl: './view.html',
  styleUrl: './view.css'
})
export class OrderPageComponent {
  @Input() id: string = ''
  
  createdDate: any
  updatedDate: any
  user: any
  sum: any
  paymentStatus: string = 'unpaid'
  fulfillmentStatus: string = 'pending'
  shippingAddress: any
  billingAddress: any
  
  message: any
  code: any

  constructor(
    route: ActivatedRoute,
    elementRef: ElementRef
  ) {
    this.#route = route
    this.#elementRef = elementRef
  }

  ngOnInit(): void {
    // FYI: Retrieve the route parameter and set it to the @Input property
    this.#route.paramMap.subscribe((params: any) => {
      this.id = params.get('id') || ''
    })
  }
  
  ngAfterViewInit() {
    // this.attachShadow({ mode: 'open' })
    // this.shadowRoot.innerHTML = renderOrderView()
    
    // document.addEventListener('click', () => this.#controller.closeOrder())
    // this.#bind('#back', 'click', () => this.#controller.closeOrder())
    
    // document.addEventListener('click', () => this.#controller.saveOrder())
    // this.#bind('#save', 'click', () => this.#controller.saveOrder())
    
    this.#presentation.subscribe(this.#renderHtml)
    this.#controller.renderOrder(this.id)
    // this.#controller.renderOrder(this.getAttribute('id'))
  }
  
  ngOnDestroy() {
    this.#presentation.unsubscribe(this.#renderHtml)
  }
  
  closeOrder = () => this.#controller.closeOrder()
  saveOrder = () => this.#controller.saveOrder()
  
  changePaymentStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.paymentStatus = selectElement.value;
  }
  
  changeFulfillmentStatus(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.fulfillmentStatus = selectElement.value;
  }

  #route: any
  #elementRef: any
  
  #presentation = new Atom()
  #navigator = new AppNavigator()

  #controller = {
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

  #isRenderingDataForTheFirstTime = true

  get #dataContainer() {
    return this.#elementRef.nativeElement.getElementById('order-data')
  }

  get #backButton() {
    return this.#elementRef.nativeElement.getElementById('back')
  }

  get #saveButton() {
    return this.#elementRef.nativeElement.getElementById('save')
  }

  #renderHtml = (presentationModel: any) => {
    console.log('subscribe to presentation')
    const { loading, error, data } = presentationModel
    const isEmpty = Object.keys(data).length === 0

    if (loading)
      this.#backButton.setAttribute('disabled', '')
    else
      this.#backButton.removeAttribute('disabled')

    if (isEmpty) {
      console.log('presentation is empty')
      
      if (loading) {
        console.log('presentation is loaded')
        // this.#dataContainer.innerHTML = renderOrderLoadingView()
      }
        
      else if (error) {
        console.log('presentation is failed')
        // this.#dataContainer.innerHTML = renderOrderLoadingErrorView(error)
      }
    } else {
      console.log('presentation is empty')
      this.#renderOrderDataView(presentationModel)
    }
      
  }

  #renderOrderDataView(presentationModel: any) {
    const viewModel = presentOrder(presentationModel)

    if (this.#isRenderingDataForTheFirstTime) {
      console.log('data render for the first time')
      // this.#dataContainer.innerHTML = renderOrderDataView(viewModel)
      // this.#bindAll('input', '[editable]', ({ currentTarget }) =>
      //   this.#controller.changeOrderField(currentTarget.dataset.bindTo, currentTarget.value))
      this.#isRenderingDataForTheFirstTime = false
    }

    if (viewModel.hasChanges)
      this.#saveButton.removeAttribute('disabled')
    else
      this.#saveButton.setAttribute('disabled', '')
  }

  // #bind(selector, event, handler) {
  //   this.shadowRoot.querySelector(selector).addEventListener(event, handler)
  // }

  // #bindAll(event, selector, handler) {
  //   this.shadowRoot.querySelectorAll(selector)
  //     .forEach(element => element.addEventListener(event, handler))
  // }
}
