import select from 'select-dom'
import debounce from 'lodash/debounce'
import storage from '../shared/storage'
import * as modals from './helpers/modals'
import * as pages from './helpers/pages'
import { runFeatureIf } from './helpers/user-settings'
import { matchRoomIsReady } from './helpers/match-room'
import clickModalPartyInviteAccept from './features/click-modal-party-invite-accept'
import clickModalMatchQueuingContinue from './features/click-modal-match-queuing-continue'
import clickModalMatchReady from './features/click-modal-match-ready'
import addMatchRoomPlayerBadges from './features/add-match-room-player-badges'
import copyMatchRoomCopyServerData from './features/copy-match-room-copy-server-data'
import clickMatchRoomConnectToServer from './features/click-match-room-connect-to-server'
import addHeaderLevelProgress from './features/add-header-level-progress'
import hideFaceitClientHasLandedBanner from './features/hide-faceit-client-has-landed-banner'
import addPlayerProfileMatchesElo from './features/add-player-profile-matches-elo'
import clickMatchRoomVetoLocations from './features/click-match-room-veto-locations'
import clickMatchRoomVetoMaps from './features/click-match-room-veto-maps'
import clickModalMatchRoomCaptainOk from './features/click-modal-match-room-captain-ok'
import addPlayerProfileLevelProgress from './features/add-player-profile-level-progress'
import addPlayerProfileMatchesDemo from './features/add-player-profile-matches-demo'
import addPlayerProfileExtendedStats from './features/add-player-profile-extended-stats'
import addPlayerProfileBadge from './features/add-player-profile-badge'
import clickModalClose from './features/click-modal-close'
import getBannedUser from './helpers/get-banned-user'
import stopToxicity from './features/stop-toxicity'
import clickModalInactiveCheck from './features/click-modal-inactive-check'
import addSidebarMatchesElo from './features/add-sidebar-matches-elo'
import applyMatchRoomFocusMode from './features/apply-match-room-focus-mode'
import addPlayerProfileLinks from './features/add-player-profile-links'
import addTeamPlayerInfo from './features/add-team-player-info'

let checkedBan = false

const debouncedPlayerProfileStatsFeatures = debounce(async parentElement => {
  await runFeatureIf(
    'playerProfileLevelProgress',
    addPlayerProfileLevelProgress,
    parentElement
  )
  await addPlayerProfileMatchesDemo(parentElement)
  await addPlayerProfileMatchesElo(parentElement)
  await addPlayerProfileExtendedStats(parentElement)
}, 200)

function observeBody() {
  if (!checkedBan) {
    return
  }

  const observer = new MutationObserver(mutationList => {
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
          debouncedPlayerProfileStatsFeatures(modalElement)
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
        runFeatureIf(
          'matchRoomFocusMode',
          applyMatchRoomFocusMode,
          mainContentElement
        )
      } else if (pages.isPlayerProfile()) {
        addPlayerProfileBadge(mainContentElement)
        addPlayerProfileLinks(mainContentElement)

        if (pages.isPlayerProfileStats()) {
          debouncedPlayerProfileStatsFeatures(mainContentElement)
        }
      } else if (pages.isTeamsOverview()) {
        runFeatureIf(
          'teamRosterPlayersInfo',
          addTeamPlayerInfo,
          mainContentElement
        )
      }
    }

    for (const mutation of mutationList) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode.shadowRoot) {
          observer.observe(addedNode.shadowRoot, {
            childList: true,
            subtree: true
          })
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

async function runOnce() {
  if (!checkedBan) {
    return
  }

  // Match room players stats have been integrated natively
  const { matchRoomShowPlayerStats } = await storage.getAll()
  if (typeof matchRoomShowPlayerStats === 'boolean') {
    localStorage.setItem('enhancerStats', matchRoomShowPlayerStats)
  }
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
