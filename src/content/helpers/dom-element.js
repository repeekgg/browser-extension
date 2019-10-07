export const ENHANCER_ATTRIBUTE = 'faceit-enhancer'

export const setFeatureAttribute = (featureName, element) =>
  element.setAttribute(`${ENHANCER_ATTRIBUTE}-${featureName}`, '')

export const hasFeatureAttribute = (featureName, element) =>
  element.hasAttribute(`${ENHANCER_ATTRIBUTE}-${featureName}`)

export const setStyle = (element, style) =>
  element.setAttribute(
    'style',
    typeof style === 'string' ? `${style}` : style.join(';')
  )
