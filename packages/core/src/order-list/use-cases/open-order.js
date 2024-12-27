export const OpenOrder = ({presentation, navigator}) => async (id) => {
  try {
    await navigator.open('order', {id})
  } catch ({message, code}) {
    presentation.update((model) => ({
      ...model,
      error: {message, code},
    }))
  }
}