import {PureComponent} from 'react'
import {Atom} from '@borshch/utilities'

export class CommonScreen extends PureComponent {
  static options = {}
  
  View
  presentation = new Atom()
  controller = {}
  present = (model) => model

  componentDidMount() {
    this.presentation.subscribe(this.#onPresentationChange);
    this.props.navigator.setOptions(this.constructor.options)
  }

  componentWillUnmount() {
    this.presentation.unsubscribe(this.#onPresentationChange);
  }

  render() {
    if (!this.View) throw new TypeError('CommonScreen: View must be defined')
    return (<this.View {...this.state} controller={this.controller} />)
  }

  #onPresentationChange = (model) => this.setState(this.present(model));
}
