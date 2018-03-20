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
import copyMatchRoomCopyServerData from './features/copy-match-room-copy-server-data'
import clickMatchRoomConnectToServer from './features/click-match-room-connect-to-server'

function observeMainContent(element) {
  const runFeatures = () => {
    if (pages.isRoomOverview() && matchRoomIsReady()) {
      addMatchRoomPlayerColors(element)
      addMatchRoomPlayerFlags(element)
      addMatchRoomPlayerElos(element)
      runFeatureIf('matchRoomShowPlayerStats', addMatchRoomPlayerStats, element)
      addMatchRoomTeamElos(element)
      runFeatureIf(
        'matchRoomAutoCopyServerData',
        copyMatchRoomCopyServerData,
        element
      )
      runFeatureIf(
        'matchRoomAutoConnectToServer',
        clickMatchRoomConnectToServer,
        element
      )
    }
  }

  runFeatures()

  const observer = new MutationObserver(runFeatures)
  observer.observe(element, { childList: true, subtree: true })
}

function observeBody() {
  let mainContentElement

  const observer = new MutationObserver(() => {
    const modalElement = select('.modal-dialog')

    if (modalElement) {
      if (modals.isInviteToParty(modalElement)) {
        runFeatureIf(
          'partyAutoAcceptInvite',
          clickModalPartyInviteAccept,
          modalElement
        )
      } else if (modals.isMatchQueuing(modalElement)) {
        runFeatureIf(
          'matchQueueAutoReady',
          clickModalMatchQueuingContinue,
          modalElement
        )
      } else if (modals.isMatchReady(modalElement)) {
        runFeatureIf('matchQueueAutoReady', clickModalMatchReady, modalElement)
      }
    }

    if (!mainContentElement) {
      mainContentElement = select('#main-content')
      if (mainContentElement) {
        observeMainContent(mainContentElement)
      }
    }
  })

  observer.observe(document.body, { childList: true })
}

observeBody()
