import {assert} from 'chai'
import {PresentOrder} from './presenter.js'
import {OrderPresentation, User} from '@clean-architecture-playground/core'
import {FunctionSpy} from '@borshch/utilities'

suite('present order', () => {
  test('render back button', () => {
    const {presentOrder} = setup()

    const {backButton: disabledBackButton} = presentOrder(OrderPresentation.make({loading: true}))
    assert.deepEqual(disabledBackButton, {
      label: 'Back',
      disabled: true,
    })

    const {backButton: enabledBackButton} = presentOrder(OrderPresentation.make({loading: false}))
    assert.deepEqual(enabledBackButton, {
      label: 'Back',
      disabled: false,
    })
  })

  test('render save button', () => {
    const {presentOrder} = setup()

    const {saveButton: emptyDataSaveButton} = presentOrder(OrderPresentation.make({
      data: {},
    }))
    assert.deepEqual(emptyDataSaveButton, {
      label: 'Save',
      disabled: true,
    })

    const {saveButton: enabledBackButton} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({fulfillmentStatus: 'fulfilled'}),
      originalData: OrderPresentation.makeData({fulfillmentStatus: 'pending'}),
    }))
    assert.deepEqual(enabledBackButton, {
      label: 'Save',
      disabled: false,
    })

    const {saveButton: disabledSaveButton} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({fulfillmentStatus: 'pending'}),
      originalData: OrderPresentation.makeData({fulfillmentStatus: 'pending'}),
    }))
    assert.deepEqual(disabledSaveButton, {
      label: 'Save',
      disabled: true,
    })
  })

  test('render loader, when there is no data and it is loading', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      loading: true,
      data: {},
    }))
    assert.deepEqual(viewModel.data, {
      state: 'loading',
      text: 'Loading...',
    })
  })

  test('render error, when there is no data and its loading failed', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      loading: false,
      data: {},
      error: {message: 'error message', code: 'error code'}
    }))
    assert.deepEqual(viewModel.data, {
      state: 'error',
      title: 'Order loading failed with error',
      description: 'error message (error code)',
    })

    const anotherViewModel = presentOrder(OrderPresentation.make({
      loading: false,
      data: {},
      error: {message: 'another error message', code: 'another error code'}
    }))
    assert.deepEqual(anotherViewModel.data, {
      state: 'error',
      title: 'Order loading failed with error',
      description: 'another error message (another error code)',
    })
  })

  test('render content, when there it is loaded', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      loading: false,
      data: OrderPresentation.makeData(),
    }))
    assert.equal(viewModel.data.state, 'content')
  })

  test('do not render error, when data updating failed (keep rendered content)', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      error: {message: 'error message', code: 'error code'},
      data: OrderPresentation.makeData(),
    }))
    assert.equal(viewModel.data.state, 'content')
  })

  test('do not render loader, when data is updating (keep rendered content)', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      loading: true,
      data: OrderPresentation.makeData(),
    }))
    assert.equal(viewModel.data.state, 'content')
  })

  test('present empty error state, when empty order is loaded', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      loading: false,
      data: {},
      error: undefined,
    }))
    assert.deepEqual(viewModel.data, {
      state: 'error',
      title: 'Order loading failed with error',
      description: 'Order is empty (should never happen, fire your server devs)',
    })
  })

  test('build data view model', () => {
    const {presentOrder} = setup()

    const viewModel = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({
        id: 'id',
        user: User.make({name: 'A Name', billingAddress: 'billing address'}),
        paymentStatus: 'unpaid',
        fulfillmentStatus: 'pending',
        shippingAddress: 'shipping address',
      }),
    }))
    assert.deepInclude(viewModel.data, {
      id: 'id',
      user: 'A Name',
      paymentStatus: 'unpaid',
      fulfillmentStatus: 'pending',
      shippingAddress: 'shipping address',
      billingAddress: 'billing address',
    })

    const anotherViewModel = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({
        id: 'anotherId',
        user: User.make({name: 'Another Name', billingAddress: 'another billing address'}),
        paymentStatus: 'paid',
        fulfillmentStatus: 'fulfilled',
        shippingAddress: 'another shipping address',
      }),
    }))
    assert.deepInclude(anotherViewModel.data, {
      id: 'anotherId',
      user: 'Another Name',
      paymentStatus: 'paid',
      fulfillmentStatus: 'fulfilled',
      shippingAddress: 'another shipping address',
      billingAddress: 'another billing address',
    })
  })

  test('format created date', () => {
    const {presentOrder, formatTime} = setup()

    const {data: {createdDate: emptyCreatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: ''}),
    }))
    assert.equal(emptyCreatedDate, '')

    formatTime.for('2023-11-12T08:12:01.010Z').returns('formatted 2023-11-12T08:12:01.010Z')
    const {data: {createdDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: '2023-11-12T08:12:01.010Z'}),
    }))
    assert.equal(createdDate, 'formatted 2023-11-12T08:12:01.010Z')

    formatTime.for('2024-12-24T17:57:03.444Z').returns('formatted 2024-12-24T17:57:03.444Z')
    const {data: {createdDate: anotherCreatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: '2024-12-24T17:57:03.444Z'}),
    }))
    assert.equal(anotherCreatedDate, 'formatted 2024-12-24T17:57:03.444Z')
  })

  test('format updated date', () => {
    const {presentOrder, formatTime} = setup()

    const {data: {updatedDate: emptyUpdatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: ''}),
    }))
    assert.equal(emptyUpdatedDate, '')

    formatTime.for('2023-11-12T08:12:01.010Z').returns('formatted 2023-11-12T08:12:01.010Z')
    const {data: {updatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: '2023-11-12T08:12:01.010Z'}),
    }))
    assert.equal(updatedDate, 'formatted 2023-11-12T08:12:01.010Z')

    formatTime.for('2024-12-24T17:57:03.444Z').returns('formatted 2024-12-24T17:57:03.444Z')
    const {data: {updatedDate: anotherUpdatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: '2024-12-24T17:57:03.444Z'}),
    }))
    assert.equal(anotherUpdatedDate, 'formatted 2024-12-24T17:57:03.444Z')
  })

  test('format sum', () => {
    const {presentOrder, formatNumber} = setup()

    formatNumber.for('0').returns('formatted 0')
    const {data: {sum: zeroSum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '0'}),
    }))
    assert.equal(zeroSum, 'formatted 0')

    formatNumber.for('1.123').returns('formatted 1.123')
    const {data: {sum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '1.123'}),
    }))
    assert.equal(sum, 'formatted 1.123')
  })
})

const setup = () => {
  const formatTime = new FunctionSpy()
  const formatNumber = new FunctionSpy()
  return {
    formatTime, formatNumber,
    presentOrder: PresentOrder({formatTime, formatNumber}),
  }
}
