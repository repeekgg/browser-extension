import select from 'select-dom'

const bannerDismissClass = `.main-header__message-bar__dismiss.clickable`

export default () => {
  const dismissButton = select(bannerDismissClass)

  if (dismissButton) {
    dismissButton.click()
  }
}
