export const User = {
  make: ({id = '', name = '', billingAddress = ''} = {}) => ({id, name, billingAddress}),
}
