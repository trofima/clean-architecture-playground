import {Atom} from '@borshch/utilities'
import {OrderListPresentation} from '../entities/order-list-presentation.js'

/**
 * fp example.
 * dependency function should be curried.
 *
 * UseCase
 */
export const updateOrderList = (orderListPresentation, {refresh = false}, {getFromStore, showNotification}) => pipe(
  () => orderListPresentation,
  updatePresentation(OrderListPresentation.setLoading, true),
  getFromPresentation(OrderListPresentation.getReadOptions, {refresh}),
  getOrdersAndUsers(getFromStore),
  then(updateOrderListPresentation(orderListPresentation, refresh)),
  catchError(handleError(orderListPresentation, showNotification)),
)()

const handleError = (orderListPresentation, showNotification) => (error) => pipe(
  () => swap(orderListPresentation, OrderListPresentation.setError, error),
  ({list: {length: orderCount}}) => orderCount,
  (orderCount) => orderCount ? showNotification({type: 'error', message: error.message}) : nothing(),
)()
const updatePresentation = (update, ...updates) => (orderListPresentation) => swap(orderListPresentation, update, ...updates)
const getFromPresentation = (getter, ...args) => (presentationModel) => getter(presentationModel, ...args)
const getUserIds = (list) => map(list, ({user}) => user)
const setUsers = (list, users) => map(list, ({user, ...rest}) => OrderListPresentation.makeOrder({
  user: users.find(({id: userId}) => userId === user)?.name,
  ...rest,
}))
const getOrdersAndUsers = (getFromStore) => pipe(
  getFromStore('orders'),
  then(getUsersAndMix(getFromStore)),
)
const updateOrderListPresentation = (orderListPresentation, refresh) => pipe(
  ({total, list, users}) => ({
    refresh, total,
    list: setUsers(list, users),
  }),
  (updates) => updatePresentation(OrderListPresentation.update, updates),
  (update) => update(orderListPresentation),
)
const getUsersAndMix = (getFromStore) => ({list, total}) => pipe(
  () => list,
  getUserIds,
  unique,
  getFromStore('users'),
  then((users) => ({total, list, users})),
)

/**
 * fp utils
 * (don't want to add any fp lib just for this example)
 */

const swap = (ref, update, ...updates) => {
  if (ref instanceof Atom) {
    return ref.update(update, ...updates)
  } else throw new Error(`swap does not support ref of type '${ref.constructor.name}'`)
}

const unique = (items) => {
  const uniqueItems = new Set(items)
  return Array.from(uniqueItems)
}

const map = (mappable, mapper) => {
  if (mappable instanceof Array) {
    return mappable.map(mapper)
  } else throw new Error(`map does not support type '${mappable.constructor.name}'`)
}

const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x)
const then = (thenable, cb) => thenable.then(cb)
const catchError = (catchable, cb) => catchable.catch(cb)
const nothing = () => {}
