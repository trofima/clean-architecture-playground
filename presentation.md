# Clean Architecture On Client Side (is actually possible)

![image](https://github.com/user-attachments/assets/6283c8dc-ded6-4350-ac3a-d6183b8f9d90)

Many misunderstand Clean Architecture as "hide everything behind abstraction" approach.
It's not about that at all. It's about **abstraction organization** principles.

## Definitions from **Clean Architecture** book by **Bob Martin**

### Entities
An **Entity is an object within our computer system that embodies a small set
of critical business rules operating on Critical Business Data**. The Entity
object either contains the Critical Business Data or has very easy access to
that data. The interface of the Entity consists of the functions that implement
the Critical Business Rules that operate on that data.

```javascript
// here OrderList is just namespece of functions that operate on `orderList` data structure
export const OrderList = {
  make: ({list = [], total = 0} = {}) => ({list, total}),
  getUniqueUserIds: ({list}) => {
    const userIds = list.map(({user}) => user)
    const uniqueUserIds = new Set(userIds)
    return Array.from(uniqueUserIds)
  },
}
```

### Use Cases
A **Use Case** is a description of the way that an automated
system is used. **It specifies the input to be provided by the user, the output to
be returned to the user, and the processing steps involved in producing that
output**. A use case describes application-specific business rules as opposed to
the Critical Business Rules within the Entities.

```javascript
// UpdateOrderList is a factory for `updateOrderList` use case. it's just closuring dependencies upon the use case creation
export const UpdateOrderList = ({presentation, dataStore, notifier}) => async ({refresh = false} = {}) => {
  const presentationModel = presentation.update(OrderListPresentation.setLoading, true)
  try {
    const readOptions = OrderListPresentation.getReadOptions(presentationModel, {refresh})
    const orderList = await dataStore.get('orders', readOptions)
    const uniqueUserIds = OrderList.getUniqueUserIds(orderList)
    const {list, total} = orderList
    const users = list.length ? await dataStore.get('users', uniqueUserIds) : []
    // ...
  } catch (error) {
    // ...
  }
}
```

### Adapters
A **Gateway is basically an adapter** - it adapts some "foreign" interface to the one required by use cases.

```javascript
// angular router integration
@Injectable({
  providedIn: 'root',
})
export class AngularNavigator implements Navigator {
  constructor(
    currentRoute: ActivatedRoute,
    router: Router,
    location: Location,
  ) {
    this.currentRoute = currentRoute
    this.#router = router
    this.#location = location
  }

  currentRoute: ActivatedRoute

  async open(path: string) {
     await this.#router.navigateByUrl(path)
  }

  async close() {
    if (this.#location.path().length)
      await this.#location.back()
    else
      await this.open('')
  }

  #router
  #location
}
```

### Controllers
A **Controller recieves and parses input data, ivokes use cases**. It also controlls 
how and when use cases are invoked (e.g. they implement retry rules for use cases failed because of offline error).

```javascript
  const Controller = ({system, reportError, renderOrder, changeOrderField, closeOrder, saveOrder) => ({
    initialize: (orderId) => {
      try {
        await renderOrder(orderId)
      } catch (error) {
        if (error instanceof OfflineError) system.once('online', () => renderOrder(orderId))
        else reportError(error)
      }
    },
    change: ({currentTarget: {name, value}}) => changeOrderField(name, value),
    close: closeOrder,
    save: saveOrder,
  })
```

### Presenters
A **Presenter's job is to accept data from the application and format it** 
for presentation so that the View can simply move it to the screen.

```javascript
// note it's indifferent to the rendering framework. but it depends on view structure.
export const presentOrderList = (presentation) => {
  const firstLoading = !presentation.list.length && presentation.loading
  return ({
    ...presentation,
    firstLoading,
    list: firstLoading
      ? Array(3).fill(undefined).map(makePlaceholderOrder)
      : presentation.list.map(({createdDate, sum, ...rest}) => ({
        ...rest,
        createdDate: formatDate(createdDate),
        sum: formatSum(sum),
      })),
  })
}
```

### Views
A **View** is the humble object that is hard to test. The code in this object is
kept as simple as possible. **It moves data into the GUI but does not process
that data**.

```html
<!-- vue.js view -->
<div class="order-list-page">
  <div class="order-page-header">
    <h1>Order List</h1>
    <button class="refresh-order-button" @click="controller.refresh">Refresh order list</button>
  </div>
  <p>Total order count: <span>{{viewModel.total}}</span></p>

  <div class="head-of-list grid-line">
      <!-- ... -->
  </div>

  <ul class="order-list">
    <template v-if="viewModel.error">
      <p>Error: {{ viewModel.error.message }}; Code: {{ viewModel.error.code }}</p>
    </template>
    <template v-else>
      <order-list-item  
        v-for="(order, index) in viewModel.list" 
        :key="order.id" 
        :itemIndex="index" 
        :itemData="order"
        :controller="controller"
      ></order-list-item>
    </template>
  </ul>
  <button v-if="viewModel.list.length < viewModel.total" 
    class="add-order-button" 
    :disabled="viewModel.loading"
    @click="controller.loadMore" 
  >
    {{viewModel.loading ? '...' : 'LoadMore'}}
  </button>
</div>
```

### Dirty Class (Function)
A Dirty Class (Function) is an integration point. This is the place where everything is initialized and connected.
It is "dirty" because it has a lot of dependencies and is almost impossible to test.

```javascript
  import ...

  // Dirty function for react hooks integration
  export const OrderList = () => {
    const {controller, viewModel} = useIntegration(makeOrderListIntegration)
    
    return viewModel && <OrderListView viewModel={viewModel} controller={controller} />
  }
  
  const makeOrderListIntegration = () => {
    const presentation = new Atom()
    const updateOrderList = UpdateOrderList({presentation, dataStore, notifier})
    const renderOrderList = RenderOrderList({presentation, updateOrderList})
    const removeOrderFromList = RemoveOrderFromList({dataStore, notifier, presentation})
    const openOrder = OpenOrder({
      notifier, presentation,
      navigator: appNavigator,
    })
  
    return {
      presentation,
      present: presentOrderList,
      controller: Controller({renderOrderList, updateOrderList, removeOrderFromList, openOrder}),
    }
  }
```

## Practice

_**Are all those abstractions mandatory? - No.**_
<br>For instance, entity data can be very simple so not requiring separate set of functions to operate on it.
Controller may be also degenerate - only accepting data and calling use cases with it without modification.
Such abstractions are not needed. Do not create them just to be.

_**Should system consist only from those four layers? - No.**_
<br>There are very complex systems that will definitly require more layers.
Some layer itself may be split to layers. For instance a complex use case 
can be split to smaller use cases and call them.

_**Where is a framework (react, angular, vue etc)? - It is outside.**_
<br>The framework related code is hard to test, so you should not couple your business and application logic to it.
Adapters (gateways) implement integrations to the framework's subsystems like rendering, routing etc.
Depending on the framework views contain markup and bind controllers to input events.
"Dirty class (function)" wires everything together.

_**What about the server? - Just another adapter.**_
<br>Server is just a sort of data storage. So dependency on it should be inverted as any other.

_**What about state management? Which to use: Redux, rxjs, mobX? - None**_
<br>State of your application consists of two parts: application wide and specific to current view.
Both of them are separate **entities**. It does not matter at all which interface you choose to interact with them.
Application wide state is nothing else but another data storage (like server or database) and so can be implemented with
any convenient interface of your choise. Current view needs to be updated upon state changes, so it's reasonable
to implement its state container as some variant of Observer pattern.

_**What is the main difference of Clean Architecure for Clien Side - Presentation is an entity**_
<br>On servers implementing CA they usually have some entity data structure, that is converted to presentation, 
wrapped into the response model and sent by network and forget about it. 
On client we actually render the presentation and often need to know its current state. So it's an entity for us!
We still have the same data entity, obtained from server, but we also have the data we actually presented. 
Those are two separate entities and should be treated as such. 

_**What about tests? - You should start with them**_
<br>Entities, Use Cases, Controllers and Presenters should be easy to test without need to render anything or use any testkits.
You should be able to substitute all dependencies with spies (mocks). If you can't - you are doing something wrong.
Should you test entites separately and substitute them with spies while testing use cases? I prefer not to because testing 
use cases and entities together ensures better system integrity. But entities may be very complex, leading to very complex test setup for use cases.
In such cases it may be totally reasonable to spy them and test separately.

_**But what about integration tests? - It's a good idea to have them. Few of them**_
<br>You should test complex integrations (dependency inversions, base classes and hooks) using relevant testkits and renderes.
But such tests should focus on testing **integration**, not system behavior. That's why you should not end up with many of such.

_**I prefer FP (OOP) - It doesn't matter. At all**_
<br>Such an architecture can be implemented using any programming paradigm. Careful abstraction organization matter, not coding style.

_**How do you even start to develop like that? - Easy**_
<br>You start with a **user story**. You transform it to the **use case** and implement it (I advice using TDD).
Implementing the use case will reveal needed dependencies and entities for you.
You don't need any design, stabilized server api and what not to begin with. The user story is enough.
The rest should be inverted anyway, because it is the very point if dependency inversion - you dictate contract, not them.
After server stabilizes it's api you write an adapter for it. After having ui, you'll be able to format presentation accordingly.
Maybe some refactor of presentation entity will be required (it won't if the user story is well defined).
But that's not a problem at all. Agile system is always ready to relentless refactor and any changes because it's... **agile**.

_**Is this the only way? - No (Yes)**_
<br>**No**, because dependnig on the system you may need totally different architecture (for a game, for example).
Such an approach works well for ui-heavy web and mobile apps written in javascript.
<br>**Yes**, because in order to make system flexible and code reusable, 
you'll have to identify relevant abstractions for your case and follow the same Clean Architecture principles to organize them well.

_**What about performance? -  Make it work -> make it right -> make it fast**_
<br>On the web network requests are taking hundreds of milisecongs. This could be the end of the performance conversation.
But since you insist... Yes, abstractions degrade performance, because any abstraction should be stored somewhere
in memory, and then be found, and then be executed. But this is true for **any** abstraction including the simplest function.
Ofcourse, you can write single scroll of code which is doing everything in fully procedural style with bitwise operations where possible.
You'll win 1 or 10 or event 100ms of execution time. And will be fired. For a good reason.
Apply common sence - care for you references to clear them, do not create redundant abstractions just in case, cache things, optimize heavy calculations etc.

**And start at last writing trully flexible, reusable and reliable code.**
