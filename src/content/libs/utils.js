import browser from 'webextension-polyfill'

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
  store = browser.storage.sync
) => {
  const options = await store.get(option)
  if (options[option]) {
    feature(parent)
  }
}
