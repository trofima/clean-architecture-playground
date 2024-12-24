const renderOrderListView = ({list, loading, error}) => `
  <div>
    ${loading ? '<p>Loading...</p>' : ''}
    ${error ? `<p>Error: ${error.message}; Code: ${error.code}</p>` : ''}
    <ul>
    ${list.map(({createdDate, user, sum, paymentStatus, fulfillmentStatus}) => `
      <li>
        ${user.name} | ${createdDate} | ${sum} | ${paymentStatus} | ${fulfillmentStatus}
      </li>
    `)}
    </ul>
  </div>
`