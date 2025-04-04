export const Controller = ({renderOrderList, openOrder, updateOrderList, removeOrderFromList}) => ({
  initialize: () => renderOrderList(),

  refresh: () => updateOrderList({refresh: true}),

  loadMore: () => updateOrderList(),

  open: ({currentTarget: {dataset: {id}}}) => openOrder(id),

  remove: async (event) => {
    event.stopPropagation()
    await removeOrderFromList(event.currentTarget.dataset.id)
  },
})
