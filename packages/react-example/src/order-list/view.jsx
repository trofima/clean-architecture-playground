import './view.css'
import deleteIcon from '../static/delete.svg'

export const OrderListView = ({viewModel: {total, list, error, loading}, controller}) => (
  <div className="order-list-page">
    <div className="order-page-header">
      <h1>Order List</h1>
      <button className="add-order-button" onClick={controller.refresh}>Refresh order list</button>
    </div>

    <p>Total order count: <span>{total}</span></p>

    <div className="head-of-list">
      <div>
        <p>User Name</p>
      </div>
      <div className="create-date">
        <p>Create Date</p>
      </div>
      <div className="sum">
        <p>Sum</p>
      </div>
      <div className="payment-status">
        <p>Payment Status</p>
      </div>
      <div className="fulfillment-status">
        <p>Fulfillment Status</p>
      </div>
    </div>

    <ul className="order-list">
      <div className="list">
        {error
          ? <p>Error: ${error.message}; Code: ${error.code}</p>
          : loading && !list.length 
            ? Array(3).fill(undefined).map(EmptyOrderItemView).map(OrderItemView(controller))
            : list?.map(OrderItemView(controller))
        }
      </div>
    </ul>
    <button className="add-order-button" onClick={controller.loadMore} disabled={loading}>{loading ? '...' : 'Load More'}</button>
  </div>
)

const OrderItemView = (controller) => ({id, createdDate, user, sum, paymentStatus, fulfillmentStatus, updating}) => (
  <li key={id} className={`order-item ${updating ? 'updating' : ''}`} onClick={() => controller.open(id)}>
    <div>
      <p>{user}</p>
    </div>
    <div>
      <p>{createdDate}</p>
    </div>
    <div>
      <p>{sum}</p>
    </div>
    <div>
      <p>{paymentStatus}</p>
    </div>
    <div>
      <p>{fulfillmentStatus}</p>
    </div>
    <div className="delete-button">
      {id &&
        <button disabled={updating} onClick={(event) => controller.remove(event, id)}>
          <img src={deleteIcon} alt="Delete order button" />
        </button>}
    </div>
  </li>
)

const EmptyOrderItemView = (_, index) => ({
  id: `placeholder${index}`, createdDate: '...', user: '...', sum: '...', paymentStatus: '...', fulfillmentStatus: '...',
})
