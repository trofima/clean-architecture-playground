export const renderOrderListView = ({list, loading, error, total}) => `
  <link rel="stylesheet" href="src/order-list/view.css">
    
  <div class="order-page">
    <div class="order-page-header">
      <h1>Orders List</h1>
      <button id="refresh" class="add-order-button">Refresh order list</button>
    </div>
    
    <ul class="order-list">
      <span>Total order count: ${total}</span>
      
      <div class="head-of-list">
        <div class="user-name">
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

      ${error
        ? `<p>Error: ${error.message}; Code: ${error.code}</p>`
        : loading && !list.length
          ? Array(3).fill(makeEmptyOrderPresentation()).map(renderOrderItem).join('')
          : list.map(renderOrderItem).join('')
      }
    </ul>
  </div>
`

const renderOrderItem = ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus}) => `
  <li class="order-line">
    <div class="user-name">
        <p>${user.name}</p>
    </div>
    <div class="user-name">
        <p>${createdDate}</p>
    </div>
    <div class="user-name">
        <p>${sum}</p>
    </div>
    <div class="user-name">
        <p>${paymentStatus}</p>
    </div>
    <div class="user-name">
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

const makeEmptyOrderPresentation = () => ({
  createdDate: '...', user: {name: '...'}, sum: '...', paymentStatus: '...', fulfillmentStatus: '...',
})