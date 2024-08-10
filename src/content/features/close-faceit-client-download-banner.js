import select from 'select-dom'
import { isFaceitNext } from '../helpers/dom-element'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'close-faceit-client-download-banner'

export default () => {
  const headerMessageBarElement = select(
    isFaceitNext()
      ? 'div[class*="MainHeaderContainerImpl__Wrapper"] #header-message-bar'
      : 'parasite-main-header-container #header-message-bar',
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
