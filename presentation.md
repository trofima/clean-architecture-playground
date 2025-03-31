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

A **Controller recieves and parses input data, ivokes use cases**. It also controlls 
how and when use cases are invoked (e.g. they implement retry rules for use cases failed because of offline error).

A **Presenter's job is to accept data from the application and format it** 
for presentation so that the View can simply move it
to the screen.

A **View** is the humble object that is hard to test. The code in this object is
kept as simple as possible. **It moves data into the GUI but does not process
that data**.
