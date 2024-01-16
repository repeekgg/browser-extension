import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'close-faceit-client-download-banner'

export default () => {
  const headerMessageBarElement = select(
    'parasite-main-header-container #header-message-bar',
  )

  if (!headerMessageBarElement) {
    return
  }

  const headerMessageBarButtonElements = select.all(
    'button',
    headerMessageBarElement,
  )

  if (headerMessageBarButtonElements.length !== 2) {
    return
  }

  const closeButtonElement = headerMessageBarButtonElements[1]

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, closeButtonElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, closeButtonElement)

  closeButtonElement.click()
}
