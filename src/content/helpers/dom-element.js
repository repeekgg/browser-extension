import select from 'select-dom'

export const ENHANCER_ATTRIBUTE = 'data-repeek'

export const setFeatureAttribute = (featureName, element) =>
  element.setAttribute(`${ENHANCER_ATTRIBUTE}-${featureName}`, '')

export const hasFeatureAttribute = (featureName, element) =>
  element.hasAttribute(`${ENHANCER_ATTRIBUTE}-${featureName}`)

export const setStyle = (element, style) =>
  element.setAttribute(
    'style',
    typeof style === 'string' ? `${style}` : style.join(';'),
  )

let isFaceitNextResult = null

export function isFaceitNext() {
  if (isFaceitNextResult !== null) {
    return isFaceitNextResult
  }

  isFaceitNextResult = select.exists('#__next')

  return isFaceitNextResult
}
