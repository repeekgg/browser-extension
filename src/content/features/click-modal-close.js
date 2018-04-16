import select from 'select-dom'

export default parent => {
  const closeButton = select('button[ng-click="close()"]', parent)

  if (closeButton) {
    closeButton.click()
  }
}
