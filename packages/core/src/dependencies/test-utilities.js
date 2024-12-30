import {AsyncFunctionSpy} from '@borshch/utilities'

export class DataStoreMock {
  get = new AsyncFunctionSpy()
  set = new AsyncFunctionSpy()
}

export class NavigatorMock {
  open = new AsyncFunctionSpy()
  openModal = new AsyncFunctionSpy()
}

export class NotifierMock {
  showNotification = new AsyncFunctionSpy()
}

export const OrderListData = {
  make: ({list = [], total = 0} = {}) => ({list, total}),
  makeOrder: ({
    id = '',
    createdDate = '',
    updatedDate = '',
    user = '',
    sum = 0,
    paymentStatus = '',
    fulfillmentStatus = '',
  } = {}) => ({id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus}),
  makeDummyOrders: (count) => Array(count).fill(undefined).map(OrderListData.makeOrder),
}
