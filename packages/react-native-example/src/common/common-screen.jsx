import {PureComponent} from 'react'
import {Atom} from '@borshch/utilities'
import {DependencyContext} from './context'

export class CommonScreen extends PureComponent {
  static getOptions() {
    return {}
  }
  
  View
  presentation = new Atom()
  controller = {}
  present = (model) => model

  componentDidMount() {
    this.presentation.subscribe(this.#onPresentationChange);
    this.controller.initialize?.()
    this.props.navigator.setOptions(this.constructor.getOptions(this.props, this.presentation.get(), this.controller));
  }

  componentWillUnmount() {
    this.presentation.unsubscribe(this.#onPresentationChange);
  }

  render() {
    if (!this.View) throw new TypeError('CommonScreen: View must be defined')
    return this.state && (<this.View {...this.state} controller={this.controller} />)
  }

  #onPresentationChange = (model) => this.setState(this.present(model));
}

CommonScreen.contextType = DependencyContext
