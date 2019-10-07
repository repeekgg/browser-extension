import select from 'select-dom'
import { notifyIf } from '../helpers/utils'

export default parent => {
  const acceptButton = select(
    'button[ng-click="acceptInvite()"][translate-once="ACCEPT"]:not([disabled])',
    parent
  )

  if (acceptButton) {
    acceptButton.click()

    notifyIf('notifyPartyAutoAcceptInvite', {
      title: 'Party Invite Accepted',
      message: 'A party invite has been accepted.'
    })
  }
}
