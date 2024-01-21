import select from 'select-dom'
import storage from '../shared/storage'
import addHeaderLevelProgress from './features/add-header-level-progress'
import addMatchRoomEloEstimation from './features/add-match-room-elo-estimation'
import addMatchRoomPlayerBadges from './features/add-match-room-player-badges'
import addMatchRoomSkinOfTheMatch from './features/add-match-room-skin-of-the-match'
import addPlayerProfileBadge from './features/add-player-profile-badge'
import addPlayerProfileExtendedStats from './features/add-player-profile-extended-stats'
import addPlayerProfileLevelProgress from './features/add-player-profile-level-progress'
import addPlayerProfileMatchesDemo from './features/add-player-profile-matches-demo'
import addPlayerProfileMatchesElo from './features/add-player-profile-matches-elo'
import addSidebarMatchesElo from './features/add-sidebar-matches-elo'
import applyMatchRoomFocusMode from './features/apply-match-room-focus-mode'
import clickMatchRoomConnectToServer from './features/click-match-room-connect-to-server'
import clickMatchRoomVetoLocations from './features/click-match-room-veto-locations'
import clickMatchRoomVetoMaps from './features/click-match-room-veto-maps'
import clickModalClose from './features/click-modal-close'
import clickModalInactiveCheck from './features/click-modal-inactive-check'
import clickModalMatchQueuingContinue from './features/click-modal-match-queuing-continue'
import clickModalMatchReady from './features/click-modal-match-ready'
import clickModalMatchRoomCaptainOk from './features/click-modal-match-room-captain-ok'
import clickModalPartyInviteAccept from './features/click-modal-party-invite-accept'
import closeFaceitClientDownloadBanner from './features/close-faceit-client-download-banner'
import copyMatchRoomCopyServerData from './features/copy-match-room-copy-server-data'
import repeekNotification from './features/repeek-notification'
import * as modals from './helpers/modals'
import * as pages from './helpers/pages'
import { runFeatureIf } from './helpers/user-settings'

function addPlayerProfileStatsFeatures(isPlayerProfileModal) {
  const parasiteContainerElement = select(
    isPlayerProfileModal
      ? 'parasite-player-profile > div'
      : '#parasite-container',
  )

  if (parasiteContainerElement?.children.length !== 4) {
    return
  }

  const statsContentRootElement = parasiteContainerElement.children[2]

  if (statsContentRootElement.children.length !== 1) {
    return
  }

  const statsContentElement = statsContentRootElement.children[0]

  if (statsContentElement.children.length < 14) {
    return
  }

  runFeatureIf('playerProfileLevelProgress', () =>
    addPlayerProfileLevelProgress(statsContentElement),
  )
  addPlayerProfileMatchesDemo(statsContentElement)
  addPlayerProfileMatchesElo(statsContentElement)
  addPlayerProfileExtendedStats(statsContentElement)
}

function observeBody() {
  const observer = new MutationObserver(() => {
    const legacyModalElement = select('.modal-dialog')

    if (legacyModalElement) {
      if (modals.isMatchQueuing(legacyModalElement)) {
        runFeatureIf(
          'matchQueueAutoReady',
          clickModalMatchQueuingContinue,
          legacyModalElement,
        )
      } else if (modals.isMatchRoomCaptain(legacyModalElement)) {
        runFeatureIf(
          ['matchRoomAutoVetoLocations', 'matchRoomAutoVetoMaps'],
          clickModalMatchRoomCaptainOk,
          legacyModalElement,
        )
      } else if (modals.isMatchVictory(legacyModalElement)) {
        runFeatureIf(
          'modalCloseMatchVictory',
          clickModalClose,
          legacyModalElement,
        )
      } else if (modals.isMatchDefeat(legacyModalElement)) {
        runFeatureIf(
          'modalCloseMatchDefeat',
          clickModalClose,
          legacyModalElement,
        )
      } else if (modals.isGlobalRankingUpdate(legacyModalElement)) {
        runFeatureIf(
          'modalCloseGlobalRankingUpdate',
          clickModalClose,
          legacyModalElement,
        )
      } else if (modals.isInactive(legacyModalElement)) {
        runFeatureIf(
          'modalClickInactiveCheck',
          clickModalInactiveCheck,
          legacyModalElement,
        )
      } else if (modals.isPlayerProfile()) {
        addPlayerProfileBadge(true)

        if (modals.isPlayerProfileStats()) {
          addPlayerProfileStatsFeatures(true)
        }
      }
    }

    runFeatureIf('matchQueueAutoReady', clickModalMatchReady)
    runFeatureIf('headerShowElo', addHeaderLevelProgress)
    runFeatureIf(
      'hideFaceitClientHasLandedBanner',
      closeFaceitClientDownloadBanner,
    )
    runFeatureIf('partyAutoAcceptInvite', clickModalPartyInviteAccept)

    addSidebarMatchesElo()

    const mainContentElement = select('#main-content')

    if (mainContentElement) {
      if (pages.isRoomOverview()) {
        addMatchRoomEloEstimation()
        addMatchRoomPlayerBadges(mainContentElement)
        addMatchRoomSkinOfTheMatch(mainContentElement)
        runFeatureIf(
          'matchRoomAutoCopyServerData',
          copyMatchRoomCopyServerData,
          mainContentElement,
        )
        runFeatureIf(
          'matchRoomAutoConnectToServer',
          clickMatchRoomConnectToServer,
          mainContentElement,
        )
        runFeatureIf(
          'matchRoomAutoVetoLocations',
          clickMatchRoomVetoLocations,
          mainContentElement,
        )
        runFeatureIf(
          'matchRoomAutoVetoMaps',
          clickMatchRoomVetoMaps,
          mainContentElement,
        )
        runFeatureIf(
          'matchRoomFocusMode',
          applyMatchRoomFocusMode,
          mainContentElement,
        )
      } else if (pages.isPlayerProfile()) {
        addPlayerProfileBadge()

        if (pages.isPlayerProfileStats()) {
          addPlayerProfileStatsFeatures()
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

async function initContent() {
  const { extensionEnabled } = await storage.getAll()

  if (!extensionEnabled) {
    return
  }

  repeekNotification()

  observeBody()
}

initContent()
