import {memo} from 'react'
import {ActivityIndicator, FlatList, StyleSheet} from 'react-native';
import {Colors, Drawer, Text, ListItem, View, Spacings, Dividers, SkeletonView, StateScreen} from 'react-native-ui-lib'

export const OrderListView = ({list, total, loading, error, controller}) => (
  <View flex useSafeArea>
    {error
    ? <ErrorView error={error} controller={controller}/>
    : !loading && total === 0
    ? <EmptyView controller={controller}/>
    : <OrderList list={list} total={total} loading={loading} controller={controller} />}
  </View>
)

const OrderList = ({list, total, loading, controller}) => (
  <>
    <ItemCounter total={total} list={list} loading={loading}/>
    {loading && !list.length 
    ? <SkeletonView
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
        onEndReached={!loading && total > list.length && controller.loadMore}
      />}
  </>
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

const ErrorView = ({error, controller}) => (
  <StateScreen
    title={'Failed to load orders'}
    subtitle={`${error.message} (${error.code})`}
    ctaLabel={'Refresh'}
    onCtaPress={() => controller.refresh()}
  />
)

const EmptyView = ({controller}) => (
  <StateScreen
    title={'There are no orders'}
    subtitle={'You can try to refresh'}
    ctaLabel={'Refresh'}
    onCtaPress={() => controller.refresh()}
  />
)

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