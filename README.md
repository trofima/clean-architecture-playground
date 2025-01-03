# Clean Architecture Playground
Opinionated example of how you can apply SOLID principles and CA to UI Web development. Based on Uncle Bob Martin Clean Architecture and Functional Design books.
You will see UseCases, Entities, Presenters, Controllers, inverted dependencies etc.
<br>
And TESTS of course - simple, fast Developer tests (as Kent Beck commanded).
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
>If you have better ideas (unlikely) - create a PR and prepare to fight.

<br>

The project contains [core](./packages/core) module and it's integration to the different ui frameworks, like [react](./packages/react-example), [angular](./packages/angular-example), [vue](./packages/vue-example) etc. There is also pure [native](./packages/native-example) example.
<br><b>It showcases how you can split business logic not only from view, but also from framework(!) and even platform</b> (yes there is [react-native](./packages/react-native-example) integration).
<br>
<br>

>[!CAUTION]
>Not all examples are already integrated. Why? Because you didn't pay me for that.

<br>
UI example (no, I'm not going to waste time on styles; only structure and use cases matter. but your are welcome to PR better styles)
<img width="997" alt="image" src="https://github.com/user-attachments/assets/0f7e7efb-a07c-4183-9005-45343eb3b6a3" />


## User Stories
In this example I implement part of backoffice for the online store. I do not intend to cover all edge cases and implement fully functional online store admin app. <b>I intend to implement practical example of several parts just as a showcase</b>. The following user stories will give you an idea of what is covered.

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
#### Change Order Payment Status
User should be able to change an order payment status.

#### Change Order Fulfillment Status
User should be able to change an order fulfillment status.

#### Change Shipping Address
User should be able to load next page to the the rest of the orders
<br>(It might be infinite scroll or pagination, decision has not been made yet)
