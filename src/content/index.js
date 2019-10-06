import select from 'select-dom'
import browser from 'webextension-polyfill'
import storage from '../libs/storage'
import * as modals from './libs/modals'
import * as pages from './libs/pages'
import { runFeatureIf } from './libs/utils'
import { matchRoomIsReady } from './libs/match-room'
import clickModalPartyInviteAccept from './features/click-modal-party-invite-accept'
import clickModalMatchQueuingContinue from './features/click-modal-match-queuing-continue'
import clickModalMatchReady from './features/click-modal-match-ready'
import addMatchRoomPlayerBadges from './features/add-match-room-player-badges'
import addMatchRoomPlayerColors from './features/add-match-room-player-colors'
import addMatchRoomPlayerFlags from './features/add-match-room-player-flags'
import addMatchRoomPlayerElos from './features/add-match-room-player-elos'
import addMatchRoomPlayerStats from './features/add-match-room-player-stats'
import addMatchRoomEloEstimation from './features/add-match-room-elo-estimation'
import copyMatchRoomCopyServerData from './features/copy-match-room-copy-server-data'
import clickMatchRoomConnectToServer from './features/click-match-room-connect-to-server'
import addHeaderLevelProgress from './features/add-header-level-progress'
import hideMatchRoomPlayerControls from './features/hide-match-room-player-controls'
import hideFaceitClientHasLandedBanner from './features/hide-faceit-client-has-landed-banner'
import addProfileMatchesEloPoints from './features/add-profile-matches-elo-points'
import clickMatchRoomVetoLocations from './features/click-match-room-veto-locations'
import clickMatchRoomVetoMaps from './features/click-match-room-veto-maps'
import clickModalMatchRoomCaptainOk from './features/click-modal-match-room-captain-ok'
import addPlayerProfileLevelProgress from './features/add-player-profile-level-progress'
import addMatchRoomPickPlayerStats from './features/add-match-room-pick-player-stats'
import addMatchRoomPickPlayerElos from './features/add-match-room-pick-player-elos'
import addMatchRoomPickPlayerFlags from './features/add-match-room-pick-player-flags'
import addPlayerControlsReportFix from './features/add-match-room-player-controls-report-fix'
import addPlayerProfileDownloadDemo from './features/add-player-profile-download-demo'
import addPlayerProfileExtendedStats from './features/add-player-profile-extended-stats'
import clickModalClose from './features/click-modal-close'
import isUserBanned from './bans/is-user-banned'
import stopToxicity from './bans/stop-toxicity'
import store from './store'
import clickModalInactiveCheck from './features/click-modal-inactive-check'
import addSidebarMatchesElo from './features/add-sidebar-matches-elo'
import addMatchRoomEloSelfResult from './features/add-match-room-elo-self-result'
import applyMatchRoomFocusMode from './features/apply-match-room-focus-mode'

function observeMainContent(element) {
  const runFeatures = () => {
    if (pages.isRoomOverview() && matchRoomIsReady()) {
      addMatchRoomPlayerBadges(element)
      addMatchRoomPlayerColors(element)
      addMatchRoomPlayerFlags(element)
      addMatchRoomPlayerElos(element)
      runFeatureIf(
        'matchRoomHidePlayerControls',
        addPlayerControlsReportFix,
        element
      )
      runFeatureIf('matchRoomShowPlayerStats', addMatchRoomPlayerStats, element)
      addMatchRoomEloEstimation(element)
      addMatchRoomEloSelfResult(element)
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
      addMatchRoomPickPlayerStats(element)
      addMatchRoomPickPlayerElos(element)
      addMatchRoomPickPlayerFlags(element)
      runFeatureIf('matchRoomFocusMode', applyMatchRoomFocusMode, element)
    } else if (pages.isPlayerProfileStats()) {
      runFeatureIf(
        'playerProfileLevelProgress',
        addPlayerProfileLevelProgress,
        element
      )
      addPlayerProfileDownloadDemo(element)
      addProfileMatchesEloPoints(element)
      addPlayerProfileExtendedStats(element)
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
      } else if (modals.isMatchRoomCaptain(modalElement)) {
        runFeatureIf(
          ['matchRoomAutoVetoLocations', 'matchRoomAutoVetoMaps'],
          clickModalMatchRoomCaptainOk,
          modalElement
        )
      } else if (modals.isMatchVictory(modalElement)) {
        runFeatureIf('modalCloseMatchVictory', clickModalClose, modalElement)
      } else if (modals.isMatchDefeat(modalElement)) {
        runFeatureIf('modalCloseMatchDefeat', clickModalClose, modalElement)
      } else if (modals.isGlobalRankingUpdate(modalElement)) {
        runFeatureIf(
          'modalCloseGlobalRankingUpdate',
          clickModalClose,
          modalElement
        )
      } else if (modals.isInactive(modalElement)) {
        runFeatureIf(
          'modalClickInactiveCheck',
          clickModalInactiveCheck,
          modalElement
        )
      } else if (modals.isPlayerProfileStats()) {
        runFeatureIf(
          'playerProfileLevelProgress',
          addPlayerProfileLevelProgress,
          modalElement
        )
        addPlayerProfileDownloadDemo(modalElement)
        addProfileMatchesEloPoints(modalElement)
        addPlayerProfileExtendedStats(modalElement)
      }
    }

    runFeatureIf('headerShowElo', addHeaderLevelProgress)
    runFeatureIf(
      'hideFaceitClientHasLandedBanner',
      hideFaceitClientHasLandedBanner
    )

    addSidebarMatchesElo()

    if (!mainContentElement) {
      mainContentElement = select('#main-content')
      if (mainContentElement) {
        observeMainContent(mainContentElement)
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

function runOnce() {
  runFeatureIf('matchRoomHidePlayerControls', hideMatchRoomPlayerControls)
}

;(async () => {
  const { extensionEnabled } = await storage.getAll()

  if (!extensionEnabled) {
    return
  }

  const { bans, vips } = await browser.runtime.sendMessage({
    action: 'fetchApi'
  })
  store.set('bans', bans)
  store.set('vips', vips)

  const bannedUser = await isUserBanned()

  if (bannedUser) {
    stopToxicity(bannedUser)
    return
  }

  observeBody()
  runOnce()
})()
