import {OrderPresentation} from '../entities/order-presentation.js'

export const ChangeOrderField = ({presentation}) => (name, value) => {
  presentation.update(OrderPresentation.updateField, {name, value})
}
