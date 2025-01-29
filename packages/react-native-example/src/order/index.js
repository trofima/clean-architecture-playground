import {ChangeOrderField, CloseOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core';
import {CommonScreen} from '../common/common-screen';
import {OrderView} from './view';

export class Order extends CommonScreen {
  static getOptions({route: {params: {id}}}) {
    return {
      title: `Order ${id}`, 
      // headerRight: () => (<Button title='Save' onPress={() => alert('Save Pressed')} />),
    }
  }
  View = OrderView

  controller = {
    initialize: () => this.#useCases.renderOrder(this.props.route.params.id),
    change: (name, value) => this.#useCases.changeOrderField(name, value),
    save:() => this.#useCases.saveOrder(),
    close: () => this.#useCases.closeOrder(),
  }

   #useCases = {
    renderOrder: RenderOrder({
      presentation: this.presentation, 
      dataStore: this.context.dataStore,
    }),
    changeOrderField: ChangeOrderField({
      presentation: this.presentation,
    }),
    saveOrder: SaveOrder({
      presentation: this.presentation,
      dataStore: this.context.dataStore,
      navigator: this.props.navigator,
      notifier: this.context.notifier,
    }),
    closeOrder: CloseOrder({
      presentation: this.presentation,
      navigator: this.props.navigator,
      notifier: this.context.notifier,
    })
  }
}