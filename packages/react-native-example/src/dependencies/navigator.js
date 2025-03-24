import {useMemo} from 'react';
import {useNavigation, usePreventRemove} from '@react-navigation/native';

const parseQueryEntry = (rawEntry) => {
  const [key, value] = rawEntry.split('=')
  return {[decodeURIComponent(key)]: decodeURIComponent(value ?? '')}
}

const ReactNativeNavigator = (navigation, preventedClosing) => {
  return {
    ...navigation,
    open: (name, _params) => {
      const [route, rawQueryParams] = name.split('?')
      const rawQueryEntries = rawQueryParams.split('&')
      const queryParams = rawQueryEntries.reduce((acc, rawEntry) => ({
        ...acc,
        ...parseQueryEntry(rawEntry),
      }), {})

      return navigation.navigate(route, queryParams)
    },
    close: () => preventedClosing.close(),
    onClose: (handler) => preventedClosing.handle = handler
  }
}

const useInvertedNavigation = () => {
  const navigation = useNavigation()
  const preventedClosing = useMemo(() => ({
    close: undefined,
    handle: undefined,
  }), [navigation])

  usePreventRemove(true, ({data}) => {
    preventedClosing.close = () => navigation.dispatch(data.action)
    preventedClosing.handle?.() ?? preventedClosing.close()
  })

  const navigator = useMemo(() => ReactNativeNavigator(navigation, preventedClosing), [navigation])
  return navigator
}

export const withNavigator = (Component) => (props) => (
  <Component {...props} navigator={useInvertedNavigation()} />
)
