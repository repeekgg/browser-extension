import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { notifyIf } from '../helpers/user-settings'

export const FEATURE_NAME = 'click-modal-match-ready'

export default async ({ baseElement } = {}) => {
  const matchCheckInModalElement = select(
    '.FuseModalPortal:has(div[class*="MatchCheckInModal"])',
    baseElement,
  )

  if (
    !matchCheckInModalElement ||
    hasFeatureAttribute(FEATURE_NAME, matchCheckInModalElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_NAME, matchCheckInModalElement)

  const acceptButton = select('button', matchCheckInModalElement)

  if (acceptButton) {
    acceptButton.click()

    notifyIf('notifyPartyAutoAcceptInvite', {
      title: 'Match Readied Up',
      message: 'A match has been readied up.',
    })
  }
}
