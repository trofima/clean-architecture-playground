import {AsyncFunctionSpy} from '@borshch/utilities'
import {Order} from '../order/entities/order.js'

export class DataStoreMock {
  get = new AsyncFunctionSpy()
  set = new AsyncFunctionSpy()
  remove = new AsyncFunctionSpy()
}

export class NavigatorMock {
  open = new AsyncFunctionSpy()
  openModal = new AsyncFunctionSpy()
  close = new AsyncFunctionSpy()
}

export class NotifierMock {
  showNotification = new AsyncFunctionSpy()
  confirm = new AsyncFunctionSpy()
}

export const makeDummyOrders = (count) => Array(count).fill(undefined).map(Order.make)
