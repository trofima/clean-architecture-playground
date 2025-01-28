import { Button, View, Text } from 'react-native';

export const OrderListView = ({controller}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Order List</Text>
    <Button title='open order' onPress={controller.openOrder} />
  </View>
)
