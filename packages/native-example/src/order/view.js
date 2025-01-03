export const renderOrderView = ({id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus, shippingAddress, billingAddress}) => `
  <link rel="stylesheet" href="src/order/view.css">

  <div class="order-page">
    <div class="title">Parameters of Order No ${id}</div>
    <div class="order-parameters">
      <div><label>Order Id: </label> ${id}</div>
      <div><label>Created Date: </label> ${createdDate}</div>
      <div><label>Updated Date: </label> ${updatedDate}</div>
      <div><label>User Name: </label> ${user}</div>
      <div><label>Sum: </label> ${sum}</div>
      <div><label>Payment Status: </label> ${paymentStatus}</div>
      <div><label>Fulfillment Status: </label> ${fulfillmentStatus}</div>
      <div><label>Shipping Address: </label> ${shippingAddress}</div>
      <div><label>Billing Address: </label> ${billingAddress}</div>
    </div>
  </div>
`

export const renderOrderLoadingView = () => `
  <link rel="stylesheet" href="src/order/view.css">

  <div class="order-page">
    <div class="loading-state">
      <p>Loading...</p>
    </div>
  </div>
`

export const renderOrderLoadingErrorView = ({message, code}) => `
  <div class="order-page">
    <p>Order loading failed with error</p>
    <p>${message} (${code})</p>
  </div>
`