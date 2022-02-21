import select from 'select-dom'

export default async parent => {
  const resumeButton = select('button[ng-click="refresh()"]', parent)

  if (resumeButton) {
    resumeButton.click()
  }
}
