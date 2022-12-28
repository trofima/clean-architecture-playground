/** Use Cases:
 * Initialization.
 *  System checks the connection status and sets it to state
 *  System contains a default user
 *
 *
 * Log in HR manager.
 * Data:
 *  <authentication-data-provider-name>
 * Primary Course:
 *  System validates the provider name
 *  System emits 'authentication' event
 *  System authenticates the user
 *  System emits 'authenticated' event
 *  System emits 'authorization' event
 *  System starts the user session
 *  System emits 'authorized' event
 *  System sets the authorized user to state
 *  System emits 'userUpdated' event
 * Error Course:
 *  Offline:
 *    System throws Offline error
 *  Unsupported provider:
 *    System throws UnsupportedProvider error
 *  Unauthenticated user:
 *    System throws Unauthenticated error
 *  Unauthorized user:
 *    System throws Unauthorized error
 *
 *
 * Log out HR manager.
 * Data:
 * Primary Course:
 *  System closes the user session
 *  System resets the user state to default
 *  System emits 'userUpdated' event
 * Error Course:
 *  Offline:
 *    System throws Offline error
 *  Unauthorized user:
 *    System throws Unauthorized error
 *
 *
 * Register HR manager.
 * Data:
 *  <name>, <surname>, <email>, <phone-number>, <role>
 * Primary Course:
 *  System validates input data
 *  System saves data to persistent storage
 * Error Course:
 *  Offline:
 *    System throws Offline error
 *  Invalid input data:
 *    System throws InvalidInput error
 *  Unauthorized user:
 *    System throws Unauthorized error
 *
 *
 * Get Employee.
 *
 *
 * List Employees.
 *
 *
 * Search Employees.
 *
 *
 * Add Employee.
 *
 *
 * Remove Employee.
 *
 *
 * Update Employee.
 *
 *
 * Create Employee Report.
 * (salary and payment info is visible only to admin HR)
 *
 *
 * Calculate Salary.
 * (only HR with 'admin' role can see)
 *
 *
 * Pay Salary.
 * (only HR with 'admin' role can pay)
 *
*/
export default class EmployeeApp {

}