export const renderOrderListView = () => `
  <link rel="stylesheet" href="src/order-list/view.css">
    
  <div class="order-list-page">
    <div class="order-page-header">
      <h1>Order List</h1>
      <button id="refresh" class="add-order-button">Refresh order list</button>
    </div>
    
    <p>Total order count: <span id="total-count"></span></p>
      
    <div class="head-of-list">
      <div>
        <p>User Name</p>
      </div>
      <div class="create-date">
        <p>Create Date</p>
      </div>
      <div class="sum">
        <p>Sum</p>
      </div>
      <div class="payment-status">
        <p>Payment Status</p>
      </div>
      <div class="fulfillment-status">
        <p>Fulfillment Status</p>
      </div>
    </div>
    
    <ul class="order-list">
      <div id="list" class="list"></div>
    </ul>
    <button id="load-more" class="add-order-button">Load More</button>
  </div>
`

export const renderOrderItem = ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus}) => `
    <li class="order-item" data-order-id="${id}">
      <div>
          <p>${user}</p>
      </div>
      <div>
          <p>${createdDate}</p>
      </div>
      <div>
          <p>${sum}</p>
      </div>
      <div>
          <p>${paymentStatus}</p>
      </div>
      <div>
          <p>${fulfillmentStatus}</p>
      </div>
      <div class="delete-button" data-order-id="${id}">
      ${id
        ? `
          <button data-order-id="${id}">
            <img src = "static/delete.svg" alt="Delete order button"/>
          </button>
        `
        : ''
      }
      </div>
    </li>
`

export const renderEmptyOrderItem = () => ({
  createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...',
})

export const renderErrorView = (error) => `<p>Error: ${error.message}; Code: ${error.code}</p>`
