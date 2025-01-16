import moment from 'moment'
import 'moment/min/locales.js'

export const formatTime = (isoString) => {
  moment.locale(window.navigator.language)
  return moment(isoString).format('LL')
}

export const formatNumber = (number) =>
  new window.Intl.NumberFormat('en-us', {style: 'currency', currency: 'USD'})
    .format(number)