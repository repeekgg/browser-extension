import select from 'select-dom'
import { isBeta } from '../helpers/is-beta'

export default (parent) => {
  const closeButton = select(
    isBeta ? 'i[title="close-icon"]' : 'button[ng-click="cancel()"]',
    parent
  )

  if (closeButton) {
    closeButton.click()
  }
}
