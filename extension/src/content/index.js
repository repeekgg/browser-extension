import clickIf from './clickIf'
import addMatchTeamInfo from './addMatchTeamInfo'
import settings, { settingsLoaded } from './settings'

console.log('FACEIT Enhancer: Started')

function run(mutations) {
  clickIf('autoReadyMatch', 'button[ng-click="ready()"]')
  clickIf('autoAcceptPartyInvite', 'button[ng-click="acceptInvite()"]')

  addMatchTeamInfo()
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
