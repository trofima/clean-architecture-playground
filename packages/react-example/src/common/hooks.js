import {useEffect, useRef, useState} from 'react'

export const useIntegration = (makeIntegration, ...options) => {
  const [viewModel, setViewModel] = useState({})
  const controllerRef = useRef({})

  useEffect(() => {
    const {controller, present, presentation} = makeIntegration(...options)
    const unsubscribe = presentation.subscribe((model) => setViewModel(present(model)))
    controllerRef.current = controller
    controller.initialize()

    return () => unsubscribe()
  }, [])

  return {
    viewModel,
    controller: controllerRef.current,
  }
}