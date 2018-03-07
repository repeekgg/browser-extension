import clickIf from './clickIf'
import addMatchTeamInfo from './addMatchTeamInfo'

console.log('FACEIT Enhancer: Started')

function run(mutations) {
  clickIf(
    'autoReadyMatch',
    'button[ng-click="close()"][translate-once="ACCEPT"]'
  )
  clickIf('autoAcceptPartyInvite', 'button[ng-click="acceptInvite()"]')

  addMatchTeamInfo()
}

const observer = new MutationObserver(run)

const observerConfig = {
  childList: true
}

const targetNode = document.body

observer.observe(targetNode, observerConfig)
