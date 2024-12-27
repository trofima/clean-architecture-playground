const renderOrderListView = ({list, loading, error}) => `
  <style>
    div.order-page {
      --baseline: 15px;

      width: 950px;
      box-sizing: border-box;

      div.order-page-header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      ul.order-list {
        width: 100%;
        display: flex;
        flex-direction: column;
        grid-gap: var(--baseline);
        padding: 0;
        box-sizing: border-box;

        div.head-of-list {
          height: fit-content;
          padding: calc(var(--baseline)/3) var(--baseline);

          display: grid;
          grid-template-columns: repeat(5, 2fr);
          grid-gap: var(--baseline);
          justify-content: flex-start;
          align-items: center;

          div {
            height: fit-content;
            width: 100%;

            p {
              height: fit-content;
              width: 100%;

              text-align: center;
              white-space: nowrap;
              user-select: none;
              pointer-events: none;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: Arial, Helvetica, sans-serif;
              font-size: small;
              color: #333;
            }
          }
        }

        li.order-line {
          width: 100%;
          height: fit-content;
          padding: calc(var(--baseline)/3) var(--baseline);

          display: grid;
          grid-template-columns: repeat(5, 2fr);
          grid-gap: var(--baseline);
          justify-content: flex-start;
          align-items: center;


          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Initial light shadow */
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          font-size: 16px;
          color: gray;
          box-sizing: border-box;

          div {
            height: fit-content;
            width: 100%;

            p {
              height: fit-content;
              width: 100%;

              text-align: center;
              white-space: nowrap;
              user-select: none;
              pointer-events: none;
              overflow: hidden;
              text-overflow: ellipsis;
              font-family: Arial, Helvetica, sans-serif;
              font-size: large;
              color: black;
            }
          }
        }
        li.order-line:hover {
          transform: translateY(-10px); /* Move up to create levitation */
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.9); /* Deeper shadow for levitation */
        }
      }
    }
  </style>
  
  <div class="order-page">
  
    <div class="order-page-header">
      <h1>Orders List</h1>
      <button>Add New Order</button>
    </div>
    
    <ul class="order-list">
      ${loading ? '<p>Loading...</p>' : ''}
      ${error ? `<p>Error: ${error.message}; Code: ${error.code}</p>` : ''}
      
      <div class="head-of-list">
        <div class="user-name">
          <p class="text-style-t2 dark">User Name</p>
        </div>
        <div class="create-date">
          <p class="text-style-t2 dark">Create Date</p>
        </div>
        <div class="sum">
          <p class="text-style-t2 dark">Sum</p>
        </div>
        <div class="payment-status">
          <p class="text-style-t2 dark">Payment Status</p>
        </div>
        <div class="fulfillment-status">
          <p class="text-style-t2 dark">Fulfillment Status</p>
        </div>
      </div>
      
      ${list.map(({ createdDate, user, sum, paymentStatus, fulfillmentStatus }) => `
        <li>
          <div class="user-name">
              <p class="text-style-t2 dark">${user.name}</p>
          </div>
          <div class="user-name">
              <p class="text-style-t2 dark">${createdDate}</p>
          </div>
          <div class="user-name">
              <p class="text-style-t2 dark">${sum}</p>
          </div>
          <div class="user-name">
              <p class="text-style-t2 dark">${paymentStatus}</p>
          </div>
          <div class="user-name">
              <p class="text-style-t2 dark">${fulfillmentStatus}</p>
          </div>
        </li>
      `)}
    </ul>
  </div>
`