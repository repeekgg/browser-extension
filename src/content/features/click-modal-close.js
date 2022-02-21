import select from 'select-dom'

export default async parent => {
  const closeButton = select('button[ng-click="cancel()"]', parent)

  if (closeButton) {
    closeButton.click()
  }
}
