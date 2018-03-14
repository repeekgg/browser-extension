import changelog from './changelog'

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'update') {
    const { installType } = await new Promise(resolve => {
      chrome.management.getSelf(resolve)
    })

    if (installType === 'development') {
      return
    }

    const { version } = chrome.runtime.getManifest()
    const changelogUrl = changelog[version]

    if (changelogUrl) {
      chrome.tabs.create({
        url: changelogUrl,
        active: true
      })
    }
  }
})
