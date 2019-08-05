import select from 'select-dom'

export default parent => {
  const resumeButton = select('button[ng-click="refresh()"]', parent)

  if (resumeButton) {
    resumeButton.click()
  }
}
