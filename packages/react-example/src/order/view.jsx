import './view.css'

export const OrderView = ({viewModel: {data, backButton, saveButton}, controller}) => (
  <div className="order-page">
    <header>
      <button id="back" disabled={backButton.disabled} onClick={controller.close}>{backButton.label}</button>
      <button id="save" disabled={saveButton.disabled} onClick={controller.save}>{saveButton.label}</button>
    </header>

    <div id="order-data">{dataViewByState[data.state](data, controller)}</div>
  </div>
)

const OrderDataView = ({
    id, createdDate, updatedDate, user, sum, paymentStatus, fulfillmentStatus, shippingAddress, 
    billingAddress,
  }, controller,
) => (
  <>
    <div className="title">Order No <span id="order-id">{id}</span></div>
    <div className="order-parameters">
      <div><label>Created Date: <input id="created-date" value={createdDate} disabled/></label></div>
      <div><label>Updated Date: <input id="updated-date" value={updatedDate} disabled/></label></div>
      <div><label>User Name: <input id="user-name" value={user} disabled/></label></div>
      <div><label>Sum: <input id="sum" value={sum} disabled/></label></div>
      <div>
        <label>Payment Status: 
          <select id="payment-status" name="paymentStatus" value={paymentStatus} onChange={controller.change}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </label>
      </div>
      <div>
        <label>Fulfillment Status: 
          <select id="fulfillment-status" name="fulfillmentStatus" value={fulfillmentStatus} onChange={controller.change}>
            <option value="pending">Pending</option>
            <option value="fulfilled">Fulfilled</option>
          </select>
        </label> 
      </div>
      <div>
        <label>Shipping Address: 
          <input id="shipping-address" type="text" name="shippingAddress" value={shippingAddress} onInput={controller.change}/>
        </label>
      </div>
      <div>
        <label>Billing Address: 
          <input id="billing-address" type="text" value={billingAddress} disabled/>
        </label>
      </div>
    </div>
  </>
)

const OrderLoadingView = () => (
  <div className="loading-state">
    <p>Loading...</p>
  </div>
)

const OrderLoadingErrorView = ({message, code}) => (
  <div className="error-state">
    <p>Order loading failed with error</p>
    <p>{message} ({code})</p>
  </div>
)

const dataViewByState = {
  loading: OrderLoadingView,
  error: OrderLoadingErrorView,
  content: OrderDataView,
}
