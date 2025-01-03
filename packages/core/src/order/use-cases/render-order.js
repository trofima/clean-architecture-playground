import {OrderPresentation} from '../entities/order-presentation.js'

export const RenderOrder = ({presentation, dataStore}) => async (id) => {
  presentation.update(() => OrderPresentation.make({loading: true}))
  try {
    const order = await dataStore.get('order', {id})
    const user = await dataStore.get('user', order.user)
    const data = {...order, user}
    presentation.update(OrderPresentation.setData, data)
  } catch (error) {
    presentation.update(OrderPresentation.setFailed, error)
  }
}
