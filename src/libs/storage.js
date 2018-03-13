const DEFAULTS = {
  autoReadyMatch: false,
  autoAcceptPartyInvite: false,
  'matchRoom.showPlayerStats': false
}

export default {
  get: item =>
    new Promise(resolve => {
      chrome.storage.sync.get(item || DEFAULTS, items => {
        if (item) {
          resolve(items[item])
        }
        resolve(items)
      })
    }),
  set: obj =>
    new Promise(resolve => {
      chrome.storage.sync.set(obj, resolve)
    })
}
