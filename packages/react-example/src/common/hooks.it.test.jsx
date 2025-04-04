import 'global-jsdom/register'
import React from 'react'
import {render, fireEvent} from '@testing-library/react'
import {useIntegration} from './hooks'
import {Atom} from '@borshch/utilities'
import {assert} from 'chai'

suite('useIntegration', () => {
  test('subscribes to presentation, initializes controller, renders presentation to view model', () => {
    const makeTestIntegration = () => {
      const presentation = new Atom()
      return {
        presentation,
        controller: {
          initialize: () => presentation.update(() => ({test1: 'test1value', test2: 'test2value'})),
        },
      }
    }
    const TestComponent = () => {
      const {viewModel} = useIntegration(makeTestIntegration)
      return <TestView viewModel={viewModel} />
    }
    const {getByTestId} = render(<TestComponent />)

    assert.equal(getByTestId('test1').textContent, 'test1value')
    assert.equal(getByTestId('test2').textContent, 'test2value')
  })

  test('render formatted presentation to view model', () => {
    const makeTestIntegration = () => {
      const presentation = new Atom()
      return {
        presentation,
        present: (viewModel) => ({test1: `formatted ${viewModel.test1}`, test2: `formatted ${viewModel.test2}`}),
        controller: {
          initialize: () => presentation.update(() => ({test1: 'test1value', test2: 'test2value'})),
        },
      }
    }
    const TestComponent = () => {
      const {viewModel} = useIntegration(makeTestIntegration)
      return <TestView viewModel={viewModel} />
    }
    const {getByTestId} = render(<TestComponent />)

    assert.equal(getByTestId('test1').textContent, 'formatted test1value')
    assert.equal(getByTestId('test2').textContent, 'formatted test2value')
  })

  test('pass dependencies to integration maker', () => {
    const makeTestIntegration = (dependency1, dependency2) => {
      const presentation = new Atom()
      return {
        presentation,
        controller: {
          initialize: () => presentation.update(() => ({test1: dependency1, test2: dependency2})),
        },
      }
    }
    const TestComponent = () => {
      const {viewModel} = useIntegration(makeTestIntegration, ['dependency1value', 'dependency2value'])
      return <TestView viewModel={viewModel} />
    }
    const {getByTestId} = render(<TestComponent />)

    assert.equal(getByTestId('test1').textContent, 'dependency1value')
    assert.equal(getByTestId('test2').textContent, 'dependency2value')
  })

  test('bind controller', () => {
    const makeTestIntegration = (dependency1, dependency2) => {
      const presentation = new Atom()
      return {
        presentation,
        controller: {
          initialize: () => presentation.update(() => ({test1: 'test1value', test2: 'test2value'})),
          test: () => presentation.update(() => ({test1: 'updatedTest1value', test2: 'updatedTest2value'})),
        },
      }
    }
    const TestComponent = () => {
      const {viewModel, controller} = useIntegration(makeTestIntegration, ['dependency1value', 'dependency2value'])
      return (
        <>
          <TestView viewModel={viewModel} />
          <button data-testId="testController" onClick={controller.test} />
        </>
      )
    }
    const {getByTestId} = render(<TestComponent />)

    fireEvent.click(getByTestId('testController'))

    assert.equal(getByTestId('test1').textContent, 'updatedTest1value')
    assert.equal(getByTestId('test2').textContent, 'updatedTest2value')
  })
})

const TestView = ({viewModel}) => viewModel && (
  <div>
    <div data-testId="test1">{viewModel.test1}</div>
    <div data-testId="test2">{viewModel.test2}</div>
  </div>
)
