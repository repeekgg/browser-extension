import select from 'select-dom'
import { notifyIf } from '../libs/utils'

export default parent => {
  const acceptButton = select(
    'button[ng-click="acceptInvite()"][translate-once="ACCEPT"]',
    parent
  )

  if (acceptButton) {
    acceptButton.click()

    notifyIf('notifyPartyAutoAcceptInvite', {
      title: 'Party Joined',
      message: 'A party invite has been accepted.'
    })
  }
}
