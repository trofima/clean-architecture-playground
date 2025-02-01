// import 'react'
import { Button } from 'react-native';
import { Picker, View, Text, TextField } from 'react-native-ui-lib';

export const OrderView = ({data, controller}) => (
  <View flex left padding-s4 bg-white>
    {data
    ? <View flex>
      <Text text60>Order {data.id}</Text>
      <TextField readonly floatingPlaceholder placeholder='Customer:' value={data.user?.name}/>
      <TextField readonly floatingPlaceholder placeholder='Created date:' value={data.createdDate}/>
      <TextField readonly floatingPlaceholder placeholder='Updated date:' value={data.updatedDate}/>
      <TextField readonly floatingPlaceholder placeholder='Sum:' value={String(data.sum)}/>
      <Picker
        floatingPlaceholder
        placeholder='Payment status'
        value={data.paymentStatus}
        onChange={(value) => controller.change('paymentStatus', value)}
        mode={Picker.modes.SINGLE}
      >
        <Picker.Item key={0} label={'Paid'} value={'paid'}/>
        <Picker.Item key={1} label={'Unpaid'} value={'unpaid'}/>
      </Picker>
      <Picker
        floatingPlaceholder
        placeholder='Fulfillment status'
        value={data.fulfillmentStatus}
        onChange={(value) => controller.change('fulfillmentStatus', value)}
        mode={Picker.modes.SINGLE}
      >
        <Picker.Item key={0} label={'Fulfilled'} value={'fulfilled'}/>
        <Picker.Item key={1} label={'Pending'} value={'pending'}/>
      </Picker>
      <TextField 
        floatingPlaceholder 
        placeholder='Shipping address:' 
        value={data.shippingAddress}
        onChangeText={(value) => controller.change('shippingAddress', value)}
      />
    </View> 
    : <Text>Empty</Text>}
  </View>
)