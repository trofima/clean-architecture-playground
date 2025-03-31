# Clean Architecture On Client Side (is actually possible)

![image](https://github.com/user-attachments/assets/6283c8dc-ded6-4350-ac3a-d6183b8f9d90)

Many misunderstand Clean Architecture as "hide everything behind abstraction" approach.
It's not about that at all. It's about **abstraction organization** principles.

## Definitions from **Clean Architecture** book by **Bob Martin**

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

A **Gateway is basically an adapter** - it adapts some "foreign" interface to the one required by use cases.

A **Controller recieves and parses input data, ivokes use cases**. It also controlls 
how and when use cases are invoked (e.g. they implement retry rules for use cases failed because of offline error).

A **Presenter's job is to accept data from the application and format it** 
for presentation so that the View can simply move it
to the screen.

A **View** is the humble object that is hard to test. The code in this object is
kept as simple as possible. **It moves data into the GUI but does not process
that data**.


## Practice

**Are all those abstractions mandatory? - No.**
For instance, entity data can be very simple so not requiring separate set of functions to operate on it.
Controller may be also degenerate - only accepting data and calling use cases with it without modification.
Such abstractions are not needed. Do not create them just to be.

**Should system consist only from those four layers? - No.**
There are very complex systems that will definitly require more layers.
Some layer itself may be split to layers. For instance a complex use case 
can be split to smaller use cases and call them.

**Where is a framework (react, angular, vue etc)? - It is outside.**
The framework related code is hard to test, so you should not couple your business and application logic to it.
Adapters (gateways) implement integrations to the framework's subsystems like rendering, routing etc.
Depending on the framework views contain markup and bind controllers to input events.
"Dirty class" or integration point wires everything together.

**What about the server? - Just another adapter.**
Server is just a sort of data storage. So dependency on it should be inverted as any other.

**What about state management? Which to use: Redux, rxjs, mobX? - None**
State of your application consists of two parts: application wide and specific to current view.
Both of them are separate **entities**. It does not matter at all which interface you choose to interact with them.
Application wide state is nothing else but another data storage (like server or database) and so can be implemented with
any convenient interface of your choise. Current view needs to be updated upon state changes, so it's reasonable
to implement its state container as some variant of Observer pattern.

**What is the main difference of Clean Architecure for Clien Side - Presentation is an entity**
On servers implementing CA they usually have some entity data structure, that is converted to presentation, 
wrapped into the response model and sent by network and forget about it. 
On client we actually render the presentation and often need to know its current state. So it's an entity for us!
We still have the same data entity, obtained from server, but we also have the data we actually presented. 
Those are two separate entities and should be treated as such. 

**What about tests? - You should start with them**
Entities, Use Cases, Controllers and Presenters should be easy to test without need to render anything or use any testkits.
You should be able to substitute all dependencies with spies (mocks). If you can't - you are doing something wrong.
Should you test entites separately and substitute them with spies while testing use cases? I prefer not to because testing 
use cases and entities together ensures better system integrity. But entities may be very complex, leading to very complex test setup for use cases.
In such cases it may be totally reasonable to spy them and test separately.

**But what about integration tests? - It's a good idea to have them. Few of them**
You should test complex integrations (dependency inversions, base classes and hooks) using relevant testkits and renderes.
But such tests should focus on testing **integration**, not system behavior. That's why you should not end up with many of such.

**I prefer FP (OOP) - It doesn't matter. At all**
Such an architecture can be implemented using any programming paradigm. Careful abstraction organization matter, not coding style.

**How do you even start to develop like that? - Easy**
You start with a **user story**. You transform it to the **use case** and implement it (I advice using TDD).
Implementing the use case will reveal needed dependencies and entities for you.
You don't need any design, stabilized server api and what not to begin with. The user story is enough.
The rest should be inverted anyway, because it is the very point if dependency inversion - you dictate contract, not them.
After server stabilizes it's api you write an adapter for it. After having ui, you'll be able to format presentation accordingly.
Maybe some refactor of presentation entity will be required (it won't if the user story is well defined).
But that's not a problem at all. Agile system is always ready to relentless refactor and any changes because it's... **agile**.
