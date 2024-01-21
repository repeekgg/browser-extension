import select from 'select-dom'
import { IS_FACEIT_BETA } from '../../shared/faceit-beta'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'close-faceit-client-download-banner'

export default () => {
  const headerMessageBarElement = select(
    IS_FACEIT_BETA
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
