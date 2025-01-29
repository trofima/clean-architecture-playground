import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {OrderList} from './src/order-list'
import {Order} from './src/order'
import {DependencyContext} from './src/common/context';
import {InMemoryDataStore} from '@clean-architecture-playground/core/dummy-dependencies';
import {withNavigator} from './src/dependencies/navigator';
import {Notifier} from './src/dependencies/notifier';

const dependencies = {
  dataStore: new InMemoryDataStore(), 
  notifier: new Notifier(),
}

const RootStack = createNativeStackNavigator({
  initialRouteName: '/',
  screens: {
    '/': withNavigator(OrderList),
    '/order': withNavigator(Order),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (
    <DependencyContext.Provider value={dependencies}>
      <Navigation />
    </DependencyContext.Provider>
  );
}
