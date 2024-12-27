import {AsyncFunctionSpy} from '@borshch/utilities'
import {OrderData} from './data-store/order-data.js'

export class DataStoreMock {
  get = new AsyncFunctionSpy()
}

export const makeDummyOrders = (count) => Array(count).fill(undefined).map(OrderData.make)

export class NavigatorMock {
  open = new AsyncFunctionSpy()
}
