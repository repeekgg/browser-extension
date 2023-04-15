import select from 'select-dom'
import { notifyIf } from '../helpers/user-settings'
import logger from '../helpers/logger'

const FEATURE_NAME = 'click-modal-match-ready'

export default parentElement => {
  const matchCheckInModalElement = select(
    'div[class*="MatchCheckInModal"]',
    parentElement
  )

  if (!matchCheckInModalElement) {
    logger.debug(FEATURE_NAME, 'No check in modal found')

    return
  }

  const acceptButton = select('button:not([disabled])', parentElement)

  if (acceptButton) {
    acceptButton.click()

    logger.debug(FEATURE_NAME, 'Check in modal button clicked')

    notifyIf('notifyPartyAutoAcceptInvite', {
      title: 'Match Readied Up',
      message: 'A match has been readied up.'
    })
  }
}
