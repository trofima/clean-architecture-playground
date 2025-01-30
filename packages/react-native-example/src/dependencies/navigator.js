import { useNavigation } from '@react-navigation/native';

const parseQueryEntry = (rawEntry) => {
  const [key, value] = rawEntry.split('=')
  return {[decodeURIComponent(key)]: decodeURIComponent(value ?? '')}
}

const ReactNativeNavigator = (navigation) => {
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

    close: () => navigation.goBack(),
  }
}

const useInvertedNavigation = () => {
  const navigation = useNavigation()
  return ReactNativeNavigator(navigation)
}

export const withNavigator = (Component) => (props) => 
  (<Component {...props} navigator={useInvertedNavigation()} />)
