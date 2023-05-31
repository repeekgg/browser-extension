import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'close-faceit-client-download-banner'

export default () => {
  const parasiteHeaderMessageBarElement = select('parasite-header-message-bar')

  if (!parasiteHeaderMessageBarElement) {
    return
  }

  const parasiteHeaderMessageBarButtonElements = select.all(
    'button',
    parasiteHeaderMessageBarElement
  )

  if (parasiteHeaderMessageBarButtonElements.length !== 2) {
    return
  }

  const closeButtonElement = parasiteHeaderMessageBarButtonElements[1]

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, closeButtonElement)) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, closeButtonElement)

  closeButtonElement.click()
}
