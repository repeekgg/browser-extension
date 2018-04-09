import select from 'select-dom'
import storage from '../libs/storage'
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
import addHeaderOwnLevel from './features/add-header-own-level'
import moveHeaderSearch from './features/move-header-search'
import hideMatchRoomPlayerControls from './features/hide-match-room-player-controls'
import addSidebarMatchesEloPoints from './features/add-sidebar-matches-elo-points'
import addProfileMatchesEloPoints from './features/add-profile-matches-elo-points'
import clickMatchRoomVetoLocations from './features/click-match-room-veto-locations'
import clickMatchRoomVetoMaps from './features/click-match-room-veto-maps'
import clickModalMatchRoomCaptainOk from './features/click-modal-match-room-captain-ok'
import addMatchRoomConnectToServerDelayed from './features/add-match-room-connect-to-server-delayed'
import addPlayerProfileLevelProgress from './features/add-player-profile-level-progress'
import addMatchRoomPickPlayerStats from './features/add-match-room-pick-player-stats'
import addMatchRoomPickPlayerElos from './features/add-match-room-pick-player-elos'
import addMatchRoomPickPlayerFlags from './features/add-match-room-pick-player-flags'
import showSidebarMatchmakingQueuing from './features/show-sidebar-matchmaking-queuing'
import addSidebarHideButton from './features/add-sidebar-hide-button'

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
      runFeatureIf(
        'matchRoomAutoVetoLocations',
        clickMatchRoomVetoLocations,
        element
      )
      runFeatureIf('matchRoomAutoVetoMaps', clickMatchRoomVetoMaps, element)
      addMatchRoomConnectToServerDelayed(element)
      addMatchRoomPickPlayerStats(element)
      addMatchRoomPickPlayerElos(element)
      addMatchRoomPickPlayerFlags(element)
    } else if (pages.isPlayerProfileStats()) {
      runFeatureIf(
        'playerProfileLevelProgress',
        addPlayerProfileLevelProgress,
        element
      )
      addProfileMatchesEloPoints(element)
    }
  }

  runFeatures()

  const observer = new MutationObserver(runFeatures)
  observer.observe(element, { childList: true, subtree: true })
}

function observeSidebarContent(element) {
  const runFeatures = () => {
    addSidebarMatchesEloPoints(element)
    showSidebarMatchmakingQueuing(element)
    addSidebarHideButton(element)
  }

  runFeatures()

  const observer = new MutationObserver(runFeatures)
  observer.observe(element, { childList: true, subtree: true })
}

function observeHeader(element) {
  const runFeatures = () => {
    moveHeaderSearch(element)
    runFeatureIf('headerShowElo', addHeaderOwnLevel, element)
  }

  runFeatures()

  const observer = new MutationObserver(runFeatures)
  observer.observe(element, { childList: true, subtree: true })
}

function observeBody() {
  let headerElement
  let sidebarContentElement
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
      } else if (modals.isMatchRoomCaptain(modalElement)) {
        runFeatureIf(
          ['matchRoomAutoVetoLocations', 'matchRoomAutoVetoMaps'],
          clickModalMatchRoomCaptainOk,
          modalElement
        )
      }
    }

    if (!headerElement) {
      headerElement = select('div.main-header__content')
      if (headerElement) {
        observeHeader(headerElement)
      }
    }

    if (!sidebarContentElement) {
      sidebarContentElement = select('#sidebar')
      if (sidebarContentElement) {
        observeSidebarContent(sidebarContentElement)
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

function runOnce() {
  runFeatureIf('matchRoomHidePlayerControls', hideMatchRoomPlayerControls)
}

storage.getAll().then(({ extensionEnabled }) => {
  if (!extensionEnabled) {
    return
  }
  observeBody()
  runOnce()
})
