# Clean Architecture Playground
Opinionated example of how you can apply SOLID principles and CA to UI Web development. Based on Uncle Bob Martin Clean Architecture and Functional Design books.
You will see **UseCases**, **Entities**, **Presenters**, **Controllers**, inverted dependencies etc.
<br>
And **TESTS** of course - simple, fast Developer tests (as Kent Beck commanded).
<br>
(experiment: copy pasted tests just to make plenty of them and ran. result - 20k tests passed in 4s. try to beat it)
<br>
<img width="172" alt="image" src="https://github.com/user-attachments/assets/18c5a9ba-507f-4445-83b0-0fa4a57ca69a" />
<br>
Used `mocha/chai` for testing (you prefer `jest` - you are my enemy).
<br>
<br>
The examples are not intended to be "true" FP, since true FP is readable only to chosen ones.
<br>
The examples are not intended to be "true" OOP. Because... because!
<br>
The intent is make it conceivable to everyone.

>[!CAUTION]
>**VERY DRAMATICALLY SUPER IMPORTANT NOTE:**
><br>
><span style="color:red">If you don't like something - I don't care...</span>
><br>
>If you have better ideas (unlikely:) - create a PR and prepare to fight.

<br>

The project contains [core](./packages/core) module and it's integration to the different ui frameworks, like [react](./packages/react-example), [angular](./packages/angular-example), [vue](./packages/vue-example) etc. There is also pure [native](./packages/native-example) example.
<br><b>It showcases how you can split business logic not only from view, but also from framework(!) and even platform</b> (yes there is [react-native](./packages/react-native-example) integration).

* Usecases and Entities can be found in [core (order, order-list)](./packages/core/src).
* Simple inverted dependency examples are in [core/src/dummy-dependencies](./packages/core/src/dummy-dependencies/index.js).
* More complex presenter example is [here](./packages/react-example/src/order/presenter.js).
* Since the system is very simple, controllers are quite degenerate and so not extracted, but there is one example [here](./packages/react-example/src/order-list/controller.js).
* Usecases and entities are written in procedural style. On UpdateOrderList usecase example you can see alternative [FP](./packages/core/src/alternatives/update-order-list.fp.js) or [OOP](./packages/core/src/alternatives/update-order-list.oop.js) style. Style doesn't really matter.

<br>

<img width="180" alt="image" align="right" src="https://github.com/user-attachments/assets/b82b3ec7-b576-4dc9-9f3e-849614a85bfb" />

Regarding **tests**. 
<br>
Such architectural approach allows you to implement classical testing pyramid -
many unit tests, some integration, few e2e.
<br>
**Whole application logic is tested with fast and simple unit tests**, like [here](./packages/core/src/order-list/use-cases/update-order-list.test.js).
<br>
Integration tests should test only... **integrations, not application logic**! 
These are things like custom [hooks](./packages/react-example/src/common/hooks.it.test.jsx), base classes, inverted dependencies etc.

<br>

>[!NOTE]
>For holding state the [Atom](https://github.com/trofima/borshch/blob/main/packages/utilities/src/atom.js) is used.
><br>
>It really doesn't matter what you are using under the hood.
><br>
>You just need some util to rerender view when presentation changes by a UseCase.
><br>
>It can be existing tool or you can implement yours, the bestest and perfectest one.

>[!NOTE]
> UI is primitive, because I'm not going to waste time on styles; only structure and use cases matter.
><br>
> But your are welcome to PR better styles.

<br>

To run example locally, clone repo, then navigate to example you are interested in (i.e. `packages/react-example`). Then:

```
npm i
```
```
npm start
```
See instructions in terminal.

<br>

### Rough UML diagram of the project architecture:
![image](https://github.com/user-attachments/assets/f4f9da3a-f52d-402b-8bd2-308200a98650)
Note that all arrows cross the App boundary **inwards**. This means <ins>everything is dependent on business logic</ins>.
<br>
This is acheived by [Dependency Inversion](https://en.wikipedia.org/wiki/Dependency_inversion_principle).
This allows easy testing, since any inverted dependency can be substituted by a test double.
Also there is no need to render markup and simulate events for executing a UseCase. It can be simply called from the test suite.
<br>

### Workflow diagram of the abstraction interactions:
![image](https://github.com/user-attachments/assets/8fcc3d01-35b1-427d-b65f-9b06cfb3e98b)

* **[abstractionName]?** means abstraction can be omitted for some reason.
e.g. controller can be so simple and degenerate that it would be unreasonable to abstract it from a framework.
* **"framework controller"** means a file where you usually bind view to the data and handlers.
e.g. `.jsx` file where you write functional component for React or `[name].component.ts` file for Angular.
In this project for consistency between frameworks those files are placed to the `[component-name]` folder and called `index.[js|ts|jsx|vue]`

## User Stories
In this example I implement part of backoffice for the online store. 
I do not intend to cover all edge cases and implement fully functional online store admin app. 
<ins>I intend to implement practical example of several parts just as a showcase</ins>. 
The following user stories will give you an idea of what is covered.

### Order List
#### Render Order List :heavy_check_mark:
User should see list of the orders (first page) and total order count.
<br>Each order should contain id, created date, customer name, sum, payment status, fulfillment status.
<br>While loading the orders, user should see some indication of that.

#### Open an Order :heavy_check_mark:
User should be able to open the order to see its details.

#### Remove an Order :heavy_check_mark:
User should be able to remove order from the list.
<br>Removal should be confirmed by user.
<br>While removing, user should not be able to interact with the order.

#### Render Next Page of Order List :heavy_check_mark:
User should be able to load next batch of the orders
<br>(It might be infinite scroll or pagination, doesn't really matter)

#### Refresh Order List :heavy_check_mark:
User should be able to refresh order list in order to see current order data

### Order Form
#### Render Order Details ✔️
User see all order details.

#### Change Order Field ✔️
User should be able to change allowed fields.
<br>For now those are: payment status, fulfillments status, shipping address.

#### Save Order ✔️
User should be able to save changed order.

#### Close Order ✔️
User should be able to close order.
<br>Closing should be confirmed by user.
