export const renderOrderView = () => `
  <link rel="stylesheet" href="src/order/view.css">

  <div class="order-page">
    <header>
      <button id="back" disabled>Back</button>
      <button id="save" disabled>Save</button>
    </header>

    <div id="order-data"></div>
  </div>
`

export const renderOrderDataView = ({
  data: {id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus, shippingAddress, billingAddress},
}) => `
  <div class="title">Order No <span id="order-id">${id}</span></div>
  <div class="order-parameters">
    <div><label>Created Date: <input id="created-date" value="${createdDate}" disabled></label></div>
    <div><label>Updated Date: <input id="updated-date" value="${updatedDate}" disabled></label></div>
    <div><label>User Name: <input id="user-name" value="${user}" disabled></label></div>
    <div><label>Sum: <input id="sum" value="${sum}" disabled></label></div>
    <div>
      <label>Payment Status: 
        <select id="payment-status" editable data-bind-to="paymentStatus">
          <option value="unpaid" ${paymentStatus === 'unpaid' ? 'selected' : ''}>Unpaid</option>
          <option value="paid" ${paymentStatus === 'paid' ? 'selected' : ''}>Paid</option>
        <select>
      </label>
    </div>
    <div>
      <label>Fulfillment Status: 
        <select id="fulfillment-status" editable data-bind-to="fulfillmentStatus">
          <option value="pending" ${fulfillmentStatus === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="fulfilled" ${fulfillmentStatus === 'fulfilled' ? 'selected' : ''}>Fulfilled</option>
        <select>
      </label> 
    </div>
    <div>
      <label>Shipping Address: 
        <input id="shipping-address" type="text" value="${shippingAddress}" editable data-bind-to="shippingAddress">
      </label>
    </div>
    <div>
      <label>Billing Address: 
        <input id="billing-address" type="text" value="${billingAddress}" disabled>
      </label>
    </div>
  </div>
`

export const renderOrderLoadingView = () => `
  <div class="loading-state">
    <p>Loading...</p>
  </div>
`

export const renderOrderLoadingErrorView = ({message, code}) => `
  <div class="error-state">
    <p>Order loading failed with error</p>
    <p>${message} (${code})</p>
  </div>
`