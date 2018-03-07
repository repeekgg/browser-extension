import clickIf from './clickIf'
import addMatchTeamInfo from './addMatchTeamInfo'
import { select } from './utils'

console.log('FACEIT Enhancer: Started')

function observeMainContent(element) {
  const observer = new MutationObserver(() => {
    addMatchTeamInfo(element)
  })

  observer.observe(element, { childList: true, subtree: true })
}

function observeBody() {
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains('modal-open')) {
      clickIf(
        'autoReadyMatch',
        'button[ng-click="close()"][translate-once="ACCEPT"]'
      )
      clickIf('autoAcceptPartyInvite', 'button[ng-click="acceptInvite()"]')
    }
  })

  observer.observe(document.body, { attributes: true })
}

function initObservers() {
  observeBody()

  const findMainContentElement = new MutationObserver(() => {
    const mainContentElement = select('#main-content')

    if (mainContentElement) {
      findMainContentElement.disconnect()
      observeMainContent(mainContentElement)
    }
  })

  findMainContentElement.observe(document.body, { childList: true })
}

initObservers()
