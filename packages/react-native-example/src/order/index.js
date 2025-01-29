import {ChangeOrderField, CloseOrder, RenderOrder, SaveOrder} from '@clean-architecture-playground/core';
import {CommonScreen} from '../common/common-screen';
import {OrderView} from './view';
import {InMemoryDataStore} from '../dependencies/data-store';

const dataStore = new InMemoryDataStore() //TODO: put to context or make it singleton
const notifier = {showNotification: ({message}) => alert(message)}

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
      dataStore,
      presentation: this.presentation, 
    }),
    changeOrderField: ChangeOrderField({presentation: this.presentation,}),
    saveOrder: SaveOrder({
      dataStore, notifier,
      presentation: this.presentation,
      navigator: this.props.navigator,
    }),
    closeOrder: CloseOrder({
      notifier,
      presentation: this.presentation,
      navigator: this.props.navigator,
    })
  }
}