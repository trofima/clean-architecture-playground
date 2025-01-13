import {useEffect, useRef, useState} from 'react'

export const useCleanArchitecture = (integrate) => {
  const [viewModel, setViewModel] = useState({})
  const controllerRef = useRef({})

  useEffect(() => {
    const {controller, present, presentation} = integrate()
    controllerRef.current = controller

    const unsubscribe = presentation.subscribe((model) => setViewModel(present(model)))
    controllerRef.current.initialize()

    return () => unsubscribe()
  }, [])

  return {
    viewModel,
    controller: controllerRef.current,
  }
}