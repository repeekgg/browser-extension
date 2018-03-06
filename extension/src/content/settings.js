let settings = {}

chrome.storage.onChanged.addListener(changedItems => {
  for (item in changedItems) {
    settings[item] =  changedItems[item].newValue
  }
})

export const settingsLoaded = new Promise(resolve => {
  chrome.storage.sync.get(null, items => {
    settings = items
    resolve()
  })
})

export default settings
