import select from 'select-dom'

const bannerDismissClass = `.main-header__message-bar__dismiss.clickable`

export default parent => {
  const dismissButton = select(bannerDismissClass, parent)

  if (dismissButton) {
    dismissButton.click()
  }
}
