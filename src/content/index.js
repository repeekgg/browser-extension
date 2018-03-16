import select from 'select-dom'
import * as modals from './libs/modals'
import * as pages from './libs/pages'
import { runFeatureIf } from './libs/utils'
import { matchRoomIsReady } from './libs/match-room'
import clickModalPartyInviteAccept from './features/click-modal-party-invite-accept'
import clickModalMatchQueuingContinue from './features/click-modal-match-queuing-continue'
import clickModalMatchReady from './features/click-modal-match-ready'
import addMatchRoomPlayerColors from './features/add-match-room-player-colors'
import addMatchRoomPlayerFlags from './features/add-match-room-player-flags'
import addMatchRoomPlayerElos from './features/add-match-room-player-elos'
import addMatchRoomPlayerStats from './features/add-match-room-player-stats'
import addMatchRoomTeamElos from './features/add-match-room-team-elos'

function observeMainContent(mainContent) {
  const observer = new MutationObserver(async () => {
    if (pages.isRoomOverview() && matchRoomIsReady()) {
      addMatchRoomPlayerColors(mainContent)
      addMatchRoomPlayerFlags(mainContent)
      addMatchRoomPlayerElos(mainContent)
      runFeatureIf(
        'matchRoomShowPlayerStats',
        addMatchRoomPlayerStats,
        mainContent
      )
      addMatchRoomTeamElos(mainContent)
    }
  })

  observer.observe(mainContent, { childList: true, subtree: true })
}

function observe() {
  const observer = new MutationObserver(() => {
    const modal = select('.modal-dialog')

    if (modal) {
      if (modals.isInviteToParty(modal)) {
        runFeatureIf(
          'partyAutoAcceptInvite',
          clickModalPartyInviteAccept,
          modal
        )
      } else if (modals.isMatchQueuing(modal)) {
        runFeatureIf(
          'matchQueueAutoReady',
          clickModalMatchQueuingContinue,
          modal
        )
      } else if (modals.isMatchReady(modal)) {
        runFeatureIf('matchQueueAutoReady', clickModalMatchReady, modal)
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
