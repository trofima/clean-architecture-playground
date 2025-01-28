import {PureComponent} from 'react';
import { Button, View, Text } from 'react-native';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {OrderList} from './src/order-list'

class Order extends PureComponent {
  componentDidMount() {
    const {navigation, route: {params: {id}}} = this.props
    navigation.setOptions({
      title: `Order ${id}`, 
      headerRight: () => (<Button title='Save' onPress={() => alert('Save Pressed')} />)})
  }

  render() {
    const {navigation, route: {params: {id}}} = this.props
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Order {id}</Text>
        <Button title='Go Back' onPress={() => navigation.goBack()} />
      </View>
    );
  }
}

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
    close: () => {
      console.log(111, 'navigation.state.params.previous_screen', navigation.state.params.previous_screen)
      return navigation.goBack()
    },
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
  'screens': {
    '/': withNavigator(OrderList),
    '/order': withNavigator(Order),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
