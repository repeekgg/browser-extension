import select from 'select-dom'
import storage from '../shared/storage'
import * as modals from './helpers/modals'
import * as pages from './helpers/pages'
import { runFeatureIf } from './helpers/user-settings'
import { matchRoomIsReady } from './helpers/match-room'
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
import addPlayerProfileBadge from './features/add-player-profile-badge'
import clickModalClose from './features/click-modal-close'
import getBannedUser from './helpers/get-banned-user'
import stopToxicity from './features/stop-toxicity'
import clickModalInactiveCheck from './features/click-modal-inactive-check'
import addSidebarMatchesElo from './features/add-sidebar-matches-elo'
import addMatchRoomEloSelfResult from './features/add-match-room-elo-self-result'
import applyMatchRoomFocusMode from './features/apply-match-room-focus-mode'
import addMatchRoomPlayerLinks from './features/add-match-room-player-links'
import addPlayerProfileLinks from './features/add-player-profile-links'

let checkedBan = false

function observeBody() {
  if (!checkedBan) {
    return
  }

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
      } else if (modals.isPlayerProfile()) {
        addPlayerProfileBadge(modalElement)
        addPlayerProfileLinks(modalElement)

        if (modals.isPlayerProfileStats()) {
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
    }

    runFeatureIf('headerShowElo', addHeaderLevelProgress)
    runFeatureIf(
      'hideFaceitClientHasLandedBanner',
      hideFaceitClientHasLandedBanner
    )

    addSidebarMatchesElo()

    const mainContentElement = select('#main-content')

    if (mainContentElement) {
      if (pages.isRoomOverview() && matchRoomIsReady()) {
        addMatchRoomPlayerBadges(mainContentElement)
        addMatchRoomPlayerColors(mainContentElement)
        addMatchRoomPlayerFlags(mainContentElement)
        addMatchRoomPlayerElos(mainContentElement)
        addMatchRoomPlayerLinks(mainContentElement)
        runFeatureIf(
          'matchRoomHidePlayerControls',
          addPlayerControlsReportFix,
          mainContentElement
        )
        runFeatureIf(
          'matchRoomShowPlayerStats',
          addMatchRoomPlayerStats,
          mainContentElement
        )
        addMatchRoomEloEstimation(mainContentElement)
        addMatchRoomEloSelfResult(mainContentElement)
        runFeatureIf(
          'matchRoomAutoCopyServerData',
          copyMatchRoomCopyServerData,
          mainContentElement
        )
        runFeatureIf(
          'matchRoomAutoConnectToServer',
          clickMatchRoomConnectToServer,
          mainContentElement
        )
        runFeatureIf(
          'matchRoomAutoVetoLocations',
          clickMatchRoomVetoLocations,
          mainContentElement
        )
        runFeatureIf(
          'matchRoomAutoVetoMaps',
          clickMatchRoomVetoMaps,
          mainContentElement
        )
        addMatchRoomPickPlayerStats(mainContentElement)
        addMatchRoomPickPlayerElos(mainContentElement)
        addMatchRoomPickPlayerFlags(mainContentElement)
        runFeatureIf(
          'matchRoomFocusMode',
          applyMatchRoomFocusMode,
          mainContentElement
        )
      } else if (pages.isPlayerProfile()) {
        addPlayerProfileBadge(mainContentElement)
        addPlayerProfileLinks(mainContentElement)

        if (pages.isPlayerProfileStats()) {
          runFeatureIf(
            'playerProfileLevelProgress',
            addPlayerProfileLevelProgress,
            mainContentElement
          )
          addProfileMatchesEloPoints(mainContentElement)
          addPlayerProfileDownloadDemo(mainContentElement)
          addPlayerProfileExtendedStats(mainContentElement)
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

function runOnce() {
  if (!checkedBan) {
    return
  }

  runFeatureIf('matchRoomHidePlayerControls', hideMatchRoomPlayerControls)
}

;(async () => {
  const { extensionEnabled } = await storage.getAll()

  if (!extensionEnabled) {
    return
  }

  const bannedUser = await getBannedUser()
  checkedBan = true
  if (bannedUser) {
    stopToxicity(bannedUser)
    return
  }

  observeBody()
  runOnce()
})()
