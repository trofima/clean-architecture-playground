import {useCallback, useEffect, useRef, useState} from 'react'

export const useIntegration = (makeIntegration, dependencies = []) => {
  const [viewModel, setViewModel] = useState()
  const controllerRef = useRef({})
  // this callback creates integration tools. this should happen only once during first render
  const cachedMakeIntegration = useCallback(makeIntegration, [])

  useEffect(() => {
    const {controller, presentation, present = (viewModel) => viewModel} = cachedMakeIntegration(...dependencies)
    const unsubscribe = presentation.subscribe((model) => setViewModel(present(model)))
    controllerRef.current = controller
    controller.initialize()

    return () => unsubscribe()
    // this effect creates integration tools. this should happen only once during first render
  }, [])

  return {
    viewModel,
    controller: controllerRef.current,
  }
}