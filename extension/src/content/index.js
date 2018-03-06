console.log('FACEIT Enhancer: Started')

const select = document.querySelector.bind(document)
const selectAll = document.querySelectorAll.bind(document)

let settings = {}

const settingsLoaded = new Promise(resolve => {
  chrome.storage.sync.get(null, items => {
    settings = items
    resolve()
  })
})

chrome.storage.onChanged.addListener(changedItems => {
  for (item in changedItems) {
    settings[item] =  changedItems[item].newValue
  }
})

function clickIf(option, selector) {
  if (settings[option]) {
    const el = select(selector)
    if (el) {
      el.click()
    }
  }
}

function run() {
  clickIf('autoReadyMatch', 'button[ng-click="ready()"]')
  clickIf('autoAcceptPartyInvite', 'button[ng-click="acceptInvite()"]')
}

function init() {
  const observer = new MutationObserver(run)

  const observerConfig = {
    childList: true
  }

  const targetNode = document.body

  observer.observe(targetNode, observerConfig)
}

settingsLoaded.then(init)
