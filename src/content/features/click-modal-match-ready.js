import select from 'select-dom'

export default parent => {
  // Quickmatch
  let acceptButton = select(
    'button[ng-click="close()"][translate-once="ACCEPT"]',
    parent
  )

  // Hubs
  if (!acceptButton) {
    acceptButton = select(
      'button[ng-click="vm.checkInMatch.checkingIn()"]',
      parent
    )
  }

  if (acceptButton) {
    acceptButton.click()
  }
}
