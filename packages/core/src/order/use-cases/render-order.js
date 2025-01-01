export const RenderOrder = ({presentation, dataStore}) => async (id) => {
  presentation.update(() => ({loading: true, order: undefined, error: undefined}))
  try {
    const order = await dataStore.get('order', {id})
    const user = await dataStore.get('user', order.user)
    presentation.update((model) => ({
      ...model,
      loading: false,
      order: {
        ...order,
        user,
      },
    }))
  } catch ({message, code}) {
    presentation.update((model) => ({
      ...model,
      loading: false,
      error: {message, code},
    }))
  }
}
