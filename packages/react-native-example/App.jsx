import {Component} from 'react';
import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {OrderList} from './src/order-list'
import {Order} from './src/order'
import {DependencyContext} from './src/common/context';
import {InMemoryDataStore} from '@clean-architecture-playground/core/dummy-dependencies';
import {withNavigator} from './src/dependencies/navigator';
import {Notifier} from './src/dependencies/notifier';
import {Toast} from 'react-native-ui-lib';

const RootStack = createNativeStackNavigator({
  initialRouteName: '/',
  screens: {
    '/': withNavigator(OrderList),
    '/order': withNavigator(Order),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default class App extends Component {
  constructor() {
    super()
    this.#dependencies = {
      dataStore: new InMemoryDataStore(), 
      notifier: new Notifier({appScreen: this}),
    }
  }

  state = {
    toast: {
      visible: false,
      position: 'bottom',
      autoDismiss: 3000,
    },
  }

  render () {
    return (
      <DependencyContext.Provider value={this.#dependencies}>
        <Navigation />
        <Toast {...this.state.toast} onDismiss={this.hideToast}/>
      </DependencyContext.Provider>
    );
  }

  showToast = (toastProps) => {
    this.setState({
      toast: {
        ...this.state.toast,
        ...toastProps,
        visible: true,
      },
    })
  }

  hideToast = () => {
    this.setState({
      toast: {
        ...this.state.toast,
        visible: false,
      },
    })
  }

  #dependencies
}
