export class AppNavigator {
  open(path) {
    const {search, pathname} = new URL(`${window.location.origin}${path}`)
    const componentName = pathToComponent[pathname]
    const urlParams = new URLSearchParams(search)
    const componentAttributes = Array.from(urlParams.entries)
      .reduce((acc, [name, value]) => `${acc} ${name}="${value}"`, '')
    const appContainer = window.document.body.querySelector('#app-container')

    window.history.pushState({}, '', path)
    appContainer.innerHTML = `
      <${componentName} ${componentAttributes}></${componentName}>
    `
  }
}

const pathToComponent = {
  '/': 'order-list',
  '/order': 'order',
}