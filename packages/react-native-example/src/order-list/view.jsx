import {memo} from 'react'
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {Colors, Drawer, Text, ListItem, View, Spacings, Dividers, SkeletonView, Assets} from 'react-native-ui-lib'

export const OrderListView = ({list, total, loading, controller}) => (
  <View useSafeArea>
    <ItemCounter total={total} list={list} loading={loading}/>
    {loading && !list.length 
    ?  <SkeletonView
        times={10}
        template={SkeletonView.templates.LIST_ITEM}
        listProps={{size: SkeletonView.sizes.LARGE}}
        style={{backgroundColor: Colors.white}}
      />
    : <FlatList
        ItemSeparatorComponent={<View style={Dividers.d10}/>}
        ListFooterComponent={list.length && loading && <ActivityIndicator/>}
        style={styles.list}
        data={list}
        renderItem={OrderListItem(controller)}
        refreshing={loading}
        onRefresh={controller.refresh}
        onEndReached={!loading && controller.loadMore}
      />}
  </View>
)

const OrderListItem = (controller) => ({item: {id, user, createdDate, sum, paymentStatus, fulfillmentStatus, updating}, index}) => (
  <Drawer
    key={index}
    fullSwipeRight
    fullRightThreshold={0.7}
    onFullSwipeRight={() => controller.remove(id)}
    rightItems={[{
      text: 'Delete',
      background: Colors.red30,
      onPress: (() => controller.remove(id)),
    }]}
  >
    <ListItem
      disabled={updating}
      backgroundColor={Colors.white}
      activeBackgroundColor={Colors.grey60}
      activeOpacity={0.3}
      paddingH-s2
      style={styles.listItem}
      onPress={() => controller.open(id)}
    >
      <ListItem.Part left centerV style={styles.listItemName}>
        <Text text80BO>{user}</Text>
      </ListItem.Part>
      <ListItem.Part middle centerV paddingH-s2 style={styles.listItemInfo}>
        <View column>
          <View marginB-s4>
            <Text text80 $textNeutral>Order id: {id}</Text>
          </View>
          <View marginB-s2>
            <Text text80BO $textNeutralHeavy>Placed on:</Text>
            <Text text80 $textNeutralHeavy>{createdDate}</Text>
          </View>
          <Text text60BO marginB-s2>Sum: {sum}</Text>
          <View>
            <Text text80BO>Status:</Text>
            <Text 
              text80BO
              green20={paymentStatus === 'paid'} 
              red40={paymentStatus === 'unpaid'}
            >
              {paymentStatus}
            </Text>
            <Text
              text80BO
              blue20={fulfillmentStatus === 'fulfilled'} 
              orange40={fulfillmentStatus === 'pending'}
            >
              {fulfillmentStatus}
            </Text>
          </View>
        </View>
      </ListItem.Part>
    </ListItem>
  </Drawer>
)

const ItemCounter = memo(({total, list, loading}) => (
  <View padding={Spacings.s2}>
    <Text text70BO>
      Loaded: {loading && !list.length
        ? '...'
        : ` ${list.length} of ${total}`}
    </Text>
  </View>
));

const styles = StyleSheet.create({
  list: {
    backgroundColor: Colors.white,
  },
  listItem: {
    height: 200,
  },
  listItemName: {
    flex: 1,
  },
  listItemInfo: {
    flex: 2,
  },
});