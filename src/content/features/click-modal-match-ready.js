import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { notifyIf } from '../helpers/user-settings'

const FEATURE_NAME = 'click-modal-match-ready'

export default async () => {
  const fuseModalPortalElements = select.all('.FuseModalPortal')

  fuseModalPortalElements.forEach((fuseModalPortalElement) => {
    const matchCheckInModalElement = select(
      'div[class*="MatchCheckInModal"]',
      fuseModalPortalElement,
    )

    if (
      !matchCheckInModalElement ||
      hasFeatureAttribute(FEATURE_NAME, fuseModalPortalElement)
    ) {
      return
    }

    setFeatureAttribute(FEATURE_NAME, fuseModalPortalElement)

    const acceptButton = select('button', fuseModalPortalElement)

    if (acceptButton) {
      acceptButton.click()

      notifyIf('notifyPartyAutoAcceptInvite', {
        title: 'Match Readied Up',
        message: 'A match has been readied up.',
      })
    }
  })
}
