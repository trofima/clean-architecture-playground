import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {OrderList} from './src/order-list'
import {Order} from './src/order'

const parseQueryEntry = (rawEntry) => {
  const [key, value] = rawEntry.split('=')
  return {[decodeURIComponent(key)]: decodeURIComponent(value ?? '')}
}

const ReactNativeNavigator = (navigation) => {
  return {
    ...navigation,
    open: (name, _params) => {
      const [route, rawQueryParams] = name.split('?')
      const rawQueryEntries = rawQueryParams.split('&')
      const queryParams = rawQueryEntries.reduce((acc, rawEntry) => ({
        ...acc,
        ...parseQueryEntry(rawEntry),
      }), {})

      return navigation.navigate(route, queryParams)
    },

    close: () => navigation.goBack(),
  }
}

const useInvertedNavigation = () => {
  const navigation = useNavigation()
  return ReactNativeNavigator(navigation)
}

const withNavigator = (Component) => (props) => {
  return (<Component {...props} navigator={useInvertedNavigation()} />);
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
  return <Navigation />;
}
