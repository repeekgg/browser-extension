import select from 'select-dom'

export default parent => {
  const acceptButton = select(
    'button[ng-click="acceptInvite()"][translate-once="ACCEPT"]',
    parent
  )

  if (acceptButton) {
    acceptButton.click()
  }
}
