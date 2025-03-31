# Clean Architecture On Client Side (is actually possible)

![image](https://github.com/user-attachments/assets/6283c8dc-ded6-4350-ac3a-d6183b8f9d90)

Definitions from **Clean Architecture** book by **Bob Martin**

An **Entity is an object within our computer system that embodies a small set
of critical business rules operating on Critical Business Data**. The Entity
object either contains the Critical Business Data or has very easy access to
that data. The interface of the Entity consists of the functions that implement
the Critical Business Rules that operate on that data.

A **Use Case** is a description of the way that an automated
system is used. **It specifies the input to be provided by the user, the output to
be returned to the user, and the processing steps involved in producing that
output**. A use case describes application-specific business rules as opposed to
the Critical Business Rules within the Entities.

A **Gateway is basically an adapter** - it adapts some "foreign" interface to the one required by use cases.

A **Controller recieves and parses input data, ivokes use cases**. It also controlls 
how and when use cases are invoked (e.g. they implement retry rules for use cases failed because of offline error).

A **Presenter's job is to accept data from the application and format it** 
for presentation so that the View can simply move it
to the screen.

A **View** is the humble object that is hard to test. The code in this object is
kept as simple as possible. **It moves data into the GUI but does not process
that data**.


**Are all those abstractions mandatory? - No.**
For instance, entity data can be very simple so not requiring separate set of functions to operate on it.
Controller may be also degenerate - only accepting data and calling use cases with it without modification.
Such abstractions are not needed. Do not create them just to be.

**Should system consists only from those four layers? - No.**
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

**What about tests? - You should start with them**
Entities, Use Cases, Controllers and Presenters should be easy to test without need to render anything or use any testkits.
You should be able to substitute all dependencies with spies (mocks). If you can't - you are doing something wrong.
Should you test entites separately and substitute them with spies while testing use cases? I prefer not to because testing 
use cases and entities together ensures better system integrity. But entities may be very complex, leading to very complex test setup for use cases.
In such cases it may be totally reasonable to spy them and test separately.

**But what about integration tests? - It's a good idea to have them. Few of them**
You should test complex integrations (dependency inversions, base classes and hooks) using relevant testkits and renderes.
But such tests should focus on testing **integration**, not system behavior. That's why you should not end up with many of such.
