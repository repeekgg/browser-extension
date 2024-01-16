import select from 'select-dom'

export default (parent) => {
  const continueButton = select(
    'button[ng-click="close()"][translate-once="CONTINUE"]',
    parent,
  )

  if (continueButton) {
    continueButton.click()
  }
}
