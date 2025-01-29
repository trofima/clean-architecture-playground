import { Button, View, Text } from 'react-native';

export const OrderView = ({data, controller}) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    {<Text>Order {data?.id}</Text>}
    {<Button title='Go Back' onPress={controller.close} />}
  </View>
)