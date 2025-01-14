import {assert} from 'chai'
import {presentOrder} from './presenter.js'
import {OrderPresentation, User} from '@clean-architecture-playground/core'

suite('present order', () => {
  test('render back button', () => {
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
    const viewModel = presentOrder(OrderPresentation.make({
      loading: false,
      data: OrderPresentation.makeData(),
    }))
    assert.equal(viewModel.data.state, 'content')
  })

  test('do not render error, when data updating failed (keep rendered content)', () => {
    const viewModel = presentOrder(OrderPresentation.make({
      error: {message: 'error message', code: 'error code'},
      data: OrderPresentation.makeData(),
    }))
    assert.equal(viewModel.data.state, 'content')
  })

  test('do not render loader, when data is updating (keep rendered content)', () => {
    const viewModel = presentOrder(OrderPresentation.make({
      loading: true,
      data: OrderPresentation.makeData(),
    }))
    assert.equal(viewModel.data.state, 'content')
  })

  test('present empty error state, when empty order is loaded', () => {
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
    const {data: {createdDate: emptyCreatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: ''}),
    }))
    assert.equal(emptyCreatedDate, '')

    const {data: {createdDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: '2023-11-12T08:12:01.010Z'}),
    }))
    assert.equal(createdDate, '2023-11-12, 08:12')

    const {data: {createdDate: anotherCreatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({createdDate: '2024-12-24T17:57:03.444Z'}),
    }))
    assert.equal(anotherCreatedDate, '2024-12-24, 17:57')
  })

  test('format updated date', () => {
    const {data: {updatedDate: emptyUpdatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: ''}),
    }))
    assert.equal(emptyUpdatedDate, '')

    const {data: {updatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: '2023-11-12T08:12:01.010Z'}),
    }))
    assert.equal(updatedDate, '2023-11-12, 08:12')

    const {data: {updatedDate: anotherUpdatedDate}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({updatedDate: '2024-12-24T17:57:03.444Z'}),
    }))
    assert.equal(anotherUpdatedDate, '2024-12-24, 17:57')
  })

  test('format sum', () => {
    const {data: {sum: zeroSum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '0'}),
    }))
    assert.equal(zeroSum, '0.00')

    const {data: {sum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '1.123'}),
    }))
    assert.equal(sum, '1.12')

    const {data: {sum: roundedSum}} = presentOrder(OrderPresentation.make({
      data: OrderPresentation.makeData({sum: '1.125'}),
    }))
    assert.equal(roundedSum, '1.13')
  })
})
