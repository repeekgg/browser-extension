import select from 'select-dom'
import * as modals from './libs/modals'
import * as pages from './libs/pages'
import { runFeatureIf } from './libs/utils'
import clickPartyInviteAccept from './features/click-party-invite-accept'
import clickMatchQueuingContinue from './features/click-match-queuing-continue'
import clickMatchReady from './features/click-match-ready'
import extendRoomOverviewInfo from './features/extend-room-overview-info'

function observeMainContent(mainContent) {
  const observer = new MutationObserver(() => {
    if (pages.isRoomOverview()) {
      extendRoomOverviewInfo(mainContent)
    }
  })

  observer.observe(mainContent, { childList: true, subtree: true })
}

function observe() {
  const observer = new MutationObserver(() => {
    const modal = select('.modal-dialog')

    if (modal) {
      if (modals.isInviteToParty(modal)) {
        runFeatureIf('autoAcceptPartyInvite', clickPartyInviteAccept, modal)
      } else if (modals.isMatchQueuing(modal)) {
        runFeatureIf('autoReadyMatch', clickMatchQueuingContinue, modal)
      } else if (modals.isMatchReady(modal)) {
        runFeatureIf('autoReadyMatch', clickMatchReady, modal)
      }
    }

    let foundMainContent = false

    if (!foundMainContent) {
      const mainContent = select('#main-content')

      if (mainContent) {
        foundMainContent = true
        observeMainContent(mainContent)
      }
    }
  })

  observer.observe(document.body, { childList: true })
}

observe()
