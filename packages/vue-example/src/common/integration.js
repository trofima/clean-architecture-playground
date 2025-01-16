import {ref, onBeforeMount, onBeforeUnmount} from 'vue'

export const useIntegration = (makeIntegration, ...options) => {
  let unsubscribeFromPresentation
  const controllerRef = ref({})
  const viewModelRef = ref({})

  onBeforeMount(() => {
    const {controller, present, presentation} = makeIntegration(...options)
    controllerRef.value = controller

    unsubscribeFromPresentation = presentation.subscribe((model) => {
      viewModelRef.value = present(model)
    })

    controller.initialize()
  })

  onBeforeUnmount(() => {
    unsubscribeFromPresentation()
  })

  return {viewModel: viewModelRef, controller: controllerRef}
}