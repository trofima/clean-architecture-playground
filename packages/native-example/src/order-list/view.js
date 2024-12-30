export const renderOrderListView = ({list, loading, error, total}) => `
  <style>
    div.order-page {
      --baseline: 15px;
      --option-transition-time: 0.3s;

      width: 100svw;
      padding: var(--baseline) calc(var(--baseline)*3);
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;

      > div.order-page-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        font-size: calc(var(--baseline)*2);
        color: #333;
        
        > button.add-order-button {
          padding: var(--baseline);
          border-radius: calc(var(--baseline)/2);
          font-size: var(--baseline);
          font-weight: 600;
          color: #333;
        }
      }

      > ul.order-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        grid-gap: var(--baseline);
        padding: 0;
        box-sizing: border-box;

        > div.head-of-list,
          li.order-line {
          height: fit-content;
          padding: calc(var(--baseline)/3) var(--baseline);

          display: grid;
          grid-template-columns: 4fr 8fr 1fr repeat(2, 4fr) 2fr;
          grid-gap: var(--baseline);
          justify-content: flex-start;
          align-items: center;

          > div {
            height: fit-content;
            width: 100%;

            > p {
              height: fit-content;
              width: 100%;
              padding: 0;
              margin: 0;

              text-align: center;
              white-space: nowrap;
              user-select: none;
              pointer-events: none;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }

        > div.head-of-list {
          > div {
            > p {
              font-size: var(--baseline);
              font-weight: 600;
              color: #333;
              opacity: 0.5;
            }
          }
        }

        > li.order-line {
          width: 100%;
          padding: calc(var(--baseline)/3) var(--baseline);

          background-color: #fff;
          border-radius: calc(var(--baseline)/2);
          box-shadow: 0 calc(var(--baseline)/3) calc(var(--baseline)/2) rgba(0, 0, 0, 0.2);
          transition: transform var(--option-transition-time) ease, box-shadow var(--option-transition-time) ease;
          box-sizing: border-box;

          > div {
            > p {
              font-size: var(--baseline);
              font-weight: 600;
              color: #333;
            }
              
            > button {
              margin-right: 0;
              padding: 0;
              border-radius: calc(var(--baseline)/2);
              color: #333;
              
              > img {
                height: calc(var(--baseline)*2);
              }
            }
            &.delete-button {
              display: flex;
              justify-content: end;
            }
          }
        }
        > li.order-line:hover {
          transform: calc(var(--baseline)/2);
          box-shadow: 0 calc(var(--baseline)/2) var(--baseline) rgba(0, 0, 0, 0.9);
        }
      }
    }
  </style>
  
  <div class="order-page">
  
    <div class="order-page-header">
      <h1>Orders List</h1>
      <button class="add-order-button">Refresh order list</button>
    </div>
    
    <ul class="order-list">
      ${error ? `<p>Error: ${error.message}; Code: ${error.code}</p>` : ''}

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
      
      ${loading && !list.length
        ? Array(3).fill(makeEmptyOrderPresentation()).map(renderOrderItem).join('')
        : list.map(renderOrderItem).join('')}
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
    ${id
      ? `<div class="delete-button">
          <button>
            <img src = "static/delete.svg" alt="Delete order button"/>
          </button>
        </div>`
      : ''
      }
  </li>
`

const makeEmptyOrderPresentation = () => ({
  createdDate: '...', user: {name: '...'}, sum: '...', paymentStatus: '...', fulfillmentStatus: '...',
})