import storage from '../../libs/storage'

export const getCurrentPath = () => location.pathname

export const hasEnhancerAttribute = element =>
  element.hasAttribute('faceit-enhancer')

export const setEnhancerAttribute = element => {
  element.setAttribute('faceit-enhancer', 'true')
}

export const runFeatureIf = async (
  option,
  feature,
  parent,
  store = storage
) => {
  if (await store.get(option)) {
    feature(parent)
  }
}
