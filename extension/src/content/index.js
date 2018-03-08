import log from 'loglevel'
import clickIf from './clickIf'
import addMatchTeamInfo from './addMatchTeamInfo'
import { select } from './utils'
import storage from '../storage'

function observeMainContent(element) {
  const observer = new MutationObserver(() => {
    addMatchTeamInfo(element)
  })

  observer.observe(element, { childList: true, subtree: true })
}

function observeBody() {
  const observer = new MutationObserver(() => {
    const modalElement = select('.modal-dialog')

    if (modalElement) {
      clickIf(
        'autoReadyMatch',
        [
          'button[ng-click="close()"][translate-once="CONTINUE"]',
          'button[ng-click="close()"][translate-once="ACCEPT"]'
        ],
        modalElement
      )

      clickIf(
        'autoAcceptPartyInvite',
        'button[ng-click="acceptInvite()"][translate-once="ACCEPT"]',
        modalElement
      )
    }
  })

  observer.observe(document.body, { childList: true })
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

storage.get('debug').then(debug => {
  initObservers()

  const originalMethod = log.methodFactory

  log.methodFactory = (methodName, logLevel, loggerName) => {
    const rawMethod = originalMethod(methodName, logLevel, loggerName)
    return message =>
      rawMethod(`[${methodName.toUpperCase()}] FACEIT Enhancer: ${message}`)
  }

  if (debug) {
    log.setLevel(0, false)
  }

  log.info('Started')
})
