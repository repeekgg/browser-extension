import select from 'select-dom'

export default async parent => {
  const okButton = select(
    'button[ng-click="close()"][translate-once="OK"]',
    parent
  )

  if (okButton) {
    okButton.click()
  }
}
