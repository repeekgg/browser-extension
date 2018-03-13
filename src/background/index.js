import changelog from './changelog'

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'update') {
    const { version } = chrome.runtime.getManifest()
    const changelogUrl = changelog[version]

    if (changelogUrl) {
      chrome.tabs.create({
        url: changelogUrl,
        active: false
      })
    }
  }
})
