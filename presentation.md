# Clean Architecture On Client Side (is actually possible)

## Pain

### Code reusability between projects or platforms.
Often there is a lot of code to share between 
modules, projects (editor, viewer), or even platforms (web, mobile).
Usually it end up's in sharing some functions, but not business, let alone application logic.
That's because code, describing behaviors, coupled to specific frameworks or libs.
<br>
**Solution: Clean Architecture**
<br>
Isolate your entities, invert dependencies to frameworks and libs.
Finally implement your use cases using the entities and inverted dependencies.

### Hard to make changes, add new features.
After some time code tend to start rotting, problems pile up making any changes hard or risky or both.
Eventually we can totally loose control of the system.
Usually among the reasons devs would list things like: 
* frequently changing product requirements, that were impossible to predict at the early stages
* outdated framework, tool whatever version
* change in server contract
* etc

**Solution: Clean Architecture**
<br>
Well, the only thing we can predict at the early stages of any project 
is that all those thing will *definitely* happen sooner or later (rather sooner).
So code rotting is solved by not trying to predict everything.
Work with what you know now, do not thing ahead too much.
Better focus on making system agile - ready for changes from the very start.
How? By decoupling from frameworks, servers, tools etc.
Will you do everything right? Surely NO!
But when your system is ready for change it won't be a problem, because it's ready for **the** change! 
Agile methodology implies *relentless* refactor. If you afraid to refactor - you did something wrong.

### Hard to test, fragile tests, flaky tests
The best tests are e2e, because they test how fully integrated system works. Sure!
At the same time these are the slowest and the flakiest tests. Very hard to write and maintain.
<br>
Another options is to fake some staff, like server, to render UI in memory and so to test.
Such tests are more like integration by complexity level.
While they are much faster than e2e, they are still slow, 
because in memory rendering is hard thing to do.
The setup of the tests is often very complex.
For checking certain aspect you need to setup or mock tons of irrelevant stuff 
just for the thing to run.
Fake implementations grow complex by themselves and so may have bugs, that are very hard to find.
Changing some code may break dozens or even hundreds of seemingly irrelevant tests.
Sometimes you need to spend more time for writing and fixing tests
than writing actual code that implements the desired change.
<br>
**Solution: Clean Architecture**
<br>
Decoupling your use cases allows you to substitute any dependency with mock.
You do not need to render anything for checking the **behavior**. Checking use case's output is enough. 
And so your test will be fast, the mocks will be simple (no fakes!!!)
and the test suites will be isolated themselves so no irrelevant tests failures.
You still need integration and e2e tests. 
But since all behaviors are already tested, integration tests will test only... integrations!
So you'll need not many of them and they will be much simpler.
Adding couple e2e's for some happy and critical flows 
will be sufficient to sleep well after Friday evening GA

<br>


![image](https://github.com/user-attachments/assets/6283c8dc-ded6-4350-ac3a-d6183b8f9d90)

Many misunderstand Clean Architecture[^1] as a "hide everything behind abstraction" approach.
It's not about that at all. It's about **abstraction organization** principles.

### Entity
**Entity[^2] contains critical business rules operating on critical business data**.

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
<br>

### Use Case
**Use Case[^3] specifies the input provided by the user, the output returned to the user, 
and the processing steps involved in producing that output**.
A use case describes application-specific rules as opposed to
the critical business rules within the Entities.

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
<br>

### Adapters
**Adapter (Gateway) adapts some "foreign" interface to the one required by use cases**. 
This abstraction implements dependency inversion.

```javascript
// adaptation of the "foreign" server interface to internal DataStore interface

export class DataStore {
  async get(entitiName, options) {
    const response = await fetch(`http://server.url/${entityName}?${makeQueryParams(options)}}`)
    return await response.json()
  }

  async set(entityName) {
    //...
  }
}
```

### Controllers
**Controller receives and parses input data, invokes use cases**. 
It also controls how and when use cases are invoked 
(e.g., they implement retry rules for use cases that failed because of an offline error).

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
**Presenter's job is to accept data from the use case and format it** 
for presentation so that the View can simply display it on the screen.

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
**View** is the humble object that is hard to test. The code in this object is
kept as simple as possible. **It renders data on the screen but does not process
that data**.

```jsx
// react markup
export const OrderView = ({userInput, submitButtonLabel, controller}) => (
  <div class="order-list-page">
    <label>{userInput.label}:</label>
    <input value="{userInput.value}">
    <button onClick={controller.submit}>{submitButtonLabel}<button/>
  </div>
)
```

### Dirty Class (Function)
**Dirty Class (Function) is an integration point**. 
This is the place where everything is initialized and connected.
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
    //...
  
    return {
      presentation,
      present: presentOrderList,
      controller: Controller({renderOrderList, updateOrderList, ...}),
    }
  }
```

## Practice

_**Are all those abstractions mandatory? - No.**_
<br>For instance, entity data can be very simple and not require 
a separate set of functions to operate on it. 
The controller may also be degenerate - only accepting data 
and calling use cases with it without modification. 
Such abstractions are not needed. Do not create them just to be..

_**Should the system consist only of those four layers? - No.**_
<br>There are very complex systems that will definitely require more layers. 
Some layers themselves may be split into layers. 
For instance, a complex use case can be split into smaller use cases and call them.

_**Where is a framework (React, Angular, Vue, etc.)? - It is outside.**_
<br>The framework-related code is hard to test, 
so you should not couple your business and application logic to it. 
Adapters implement integrations to the framework's subsystems like rendering, routing, etc. 
Depending on the framework, views contain markup and bind controllers to input events. 
This allows for relatively simple migration to newer breaking framework versions 
or even changing the framework altogether.

_**What about the server? - Just another adapter.**_
<br>The server is just a sort of data storage. So, dependency on it should be inverted like any other.

_**What about state management? Which to use: Redux, RxJS, MobX? - None.**_
<br>The state of your application consists of two parts: 
application-wide and specific to the current view.
Both of them are separate entities. 
It does not matter which interface you choose to interact with them. 
The application-wide state is nothing more than another data storage (like a server or database) 
and can be implemented with any convenient interface of your choice. 
The current view needs to be updated upon state changes, 
so it's reasonable to implement its state container as some variant of the Observer pattern.

_**What is the main difference of Clean Architecure for Clien Side - Presentation is an entity!**_
<br>On servers implementing CA, 
they usually have some entity data structure that is converted to presentation, 
wrapped into the response model, sent by network, and is forgotten. 
On the client side, we actually render the presentation and often need to know its current state. 
So, it's an entity for us! We still have the same data entity obtained from the server, 
but we also have the data we actually presented. 
These are two separate entities and should be treated as such. 

_**What about tests? - You should start with them.**_
<br>Entities, Use Cases, Controllers, and Presenters should be easy to test 
without needing to render anything or use any test kits. 
You should be able to substitute all dependencies with spies (mocks). 
If you can't, you are doing something wrong. 
If you need complex test kits, you are doing something wrong. 
Should you test entities separately and substitute them with spies while testing use cases? 
I prefer not to because testing use cases and entities together ensures better system integrity. 
However, entities may be very complex, leading to a very complex test setup for use cases. 
In such cases, it may be totally reasonable to spy on them and test separately."

_**But what about integration tests? - It's a good idea to have them. Few of them.**_
<br>You should test complex integrations (dependency inversions, base classes, and hooks) 
using relevant test kits and renderers. 
But such tests should focus on testing **integration, not system behavior**. 
That's why you should not end up with many of them.

_**I prefer FP (OOP) - It doesn't matter. At all.**_
<br>Such an architecture can be implemented using any programming paradigm. 
**Careful abstraction organization matters**, not coding style.

_**How do you even start to develop like that? - Easy.**_
<br>You start with a user story. You transform it into the use case and implement it (I advise using TDD). 
Implementing the use case will reveal the needed dependencies and entities for you. 
You don't need any design, stabilized server API, and whatnot to begin with. 
The user story is enough. The rest should be inverted anyway, 
because it is the very point of dependency inversion - you dictate the contract, not them. 
After the server stabilizes its API, you write an adapter for it. 
After having the UI, you'll be able to format the presentation accordingly. 
Maybe some refactoring of the presentation entity will be required (it won't if the user story is well defined). 
But that's not a problem at all. 
An agile system is always ready for relentless refactoring and any changes because it's... **agile**.

_**Is this the only way? - No (Yes).**_
<br>**No**, because depending on the system, you may need a totally different architecture (for a game, for example). 
The presented approach works well for UI-heavy web and mobile apps written in JavaScript. 
<br>**Yes**, because in order to make the system flexible and code reusable, 
you need to identify relevant abstractions for your case 
and follow the same Clean Architecture principles to organize them well (SOLID, Dependency Rule, etc.).

_**What about performance? -  Make it work -> make it right -> make it fast.**_
<br>On the web, network requests take hundreds of milliseconds. 
This could be the end of the performance conversation. But since you insist... 
Yes, abstractions degrade performance, because any abstraction should be stored somewhere in memory, 
and then be found, and then be executed. But **this is true for any abstraction**, including the simplest function. 
Of course, you can write a single scroll of code 
that does everything in a fully procedural style with bitwise operations where possible. 
You'll win 1 or 10 or even 100ms of execution time. And you will be fired. For a good reason. 
Apply common sense - care for your references to clear them, 
do not create redundant abstractions just in case, cache things, optimize heavy calculations, etc.

**So start at last writing trully flexible, reusable and reliable code.**

[^1]: Based on "Clean Architecture" and "Functional Design" books by Uncle Bob Martin.

[^2]: An Entity is an object within our computer system that embodies a small set
of critical business rules operating on Critical Business Data. The Entity
object either contains the Critical Business Data or has very easy access to
that data. The interface of the Entity consists of the functions that implement
the Critical Business Rules that operate on that data ("Clean Architecture" Bob Martin).

[^3]: A Use Case is a description of the way that an automated
system is used. It specifies the input to be provided by the user, the output to
be returned to the user, and the processing steps involved in producing that
output. A use case describes application-specific business rules as opposed to
the Critical Business Rules within the Entities.
