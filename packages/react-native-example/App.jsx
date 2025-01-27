import {PureComponent} from 'react';
import { Button, View, Text } from 'react-native';
import { createStaticNavigation, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

class OrderList extends PureComponent {
  componentDidMount() {
    this.props.navigation.setOptions({title: `Orders`})
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Order List</Text>
        <Button title='open order' onPress={() => this.props.navigation.navigate('/order?id=someId')} />
      </View>
    );
  }
}

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

const ReactNativeNavigation = (navigation) => {
  return {
    ...navigation,
    navigate: (name, _params) => {
      const [route, rawQueryParams] = name.split('?')
      const rawQueryEntries = rawQueryParams.split('&')
      const queryParams = rawQueryEntries.reduce((acc, rawEntry) => ({
        ...acc,
        ...parseQueryEntry(rawEntry),
      }), {})
      
      return navigation.navigate(route, queryParams)
    }
  }
}

const useInvertedNavigation = () => {
  const navigation = useNavigation()
  return ReactNativeNavigation(navigation)
}

const withNavigation = (Component) => (props) => {
  return (<Component {...props} navigation={useInvertedNavigation()} />);
}

const RootStack = createNativeStackNavigator({
  initialRouteName: '/',
  'screens': {
    '/': withNavigation(OrderList),
    '/order': withNavigation(Order),
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
