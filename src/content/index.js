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
import clickModalInactiveCheck from './features/click-modal-inactive-check'
import addSidebarMatchesElo from './features/add-sidebar-matches-elo'
import applyMatchRoomFocusMode from './features/apply-match-room-focus-mode'
import addPlayerProfileLinks from './features/add-player-profile-links'
import addTeamPlayerInfo from './features/add-team-player-info'
import repeekNotification from './features/repeek-notification'
import addMatchRoomSkinOfTheMatch from './features/add-match-room-skin-of-the-match'
import logger from './helpers/logger'

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
  const observer = new MutationObserver(mutationList => {
    const legacyModalElement = select('.modal-dialog')

    if (legacyModalElement) {
      if (modals.isMatchQueuing(legacyModalElement)) {
        runFeatureIf(
          'matchQueueAutoReady',
          clickModalMatchQueuingContinue,
          legacyModalElement
        )
      } else if (modals.isMatchRoomCaptain(legacyModalElement)) {
        runFeatureIf(
          ['matchRoomAutoVetoLocations', 'matchRoomAutoVetoMaps'],
          clickModalMatchRoomCaptainOk,
          legacyModalElement
        )
      } else if (modals.isMatchVictory(legacyModalElement)) {
        runFeatureIf(
          'modalCloseMatchVictory',
          clickModalClose,
          legacyModalElement
        )
      } else if (modals.isMatchDefeat(legacyModalElement)) {
        runFeatureIf(
          'modalCloseMatchDefeat',
          clickModalClose,
          legacyModalElement
        )
      } else if (modals.isGlobalRankingUpdate(legacyModalElement)) {
        runFeatureIf(
          'modalCloseGlobalRankingUpdate',
          clickModalClose,
          legacyModalElement
        )
      } else if (modals.isInactive(legacyModalElement)) {
        runFeatureIf(
          'modalClickInactiveCheck',
          clickModalInactiveCheck,
          legacyModalElement
        )
      } else if (modals.isPlayerProfile()) {
        addPlayerProfileBadge(legacyModalElement)
        addPlayerProfileLinks(legacyModalElement)

        if (modals.isPlayerProfileStats()) {
          debouncedPlayerProfileStatsFeatures(legacyModalElement)
        }
      }
    }

    const parasiteFuseModalElements = select.all('.FuseModalPortal')

    for (const parasiteFuseModalElement of parasiteFuseModalElements) {
      if (parasiteFuseModalElement?.shadowRoot) {
        runFeatureIf(
          'matchQueueAutoReady',
          clickModalMatchReady,
          parasiteFuseModalElement.shadowRoot
        )
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
        addMatchRoomSkinOfTheMatch(mainContentElement)
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

async function observeParasiteModalContainer() {
  const loggerContext = 'observe-parasite-modal-container'

  try {
    let interval
    let timeout

    const parasiteModalContainerShadowRoot = await new Promise(
      (resolve, reject) => {
        interval = setInterval(() => {
          const parasiteModalContainerElement = select(
            '#parasite-modal-container'
          )

          if (parasiteModalContainerElement?.shadowRoot) {
            clearInterval(interval)
            clearTimeout(timeout)
            resolve(parasiteModalContainerElement.shadowRoot)
          }
        }, 200)

        timeout = setTimeout(() => {
          clearInterval(interval)
          reject(
            new Error('Could not find parasite modal container shadow root')
          )
        }, 10000)
      }
    )

    logger.debug(loggerContext, 'Found parasite modal container shadow root')

    const observer = new MutationObserver(() => {
      runFeatureIf(
        'partyAutoAcceptInvite',
        clickModalPartyInviteAccept,
        parasiteModalContainerShadowRoot
      )
    })

    observer.observe(parasiteModalContainerShadowRoot, {
      childList: true,
      subtree: true
    })
  } catch (error) {
    logger.error(loggerContext, error)
  }
}

;(async () => {
  const { extensionEnabled } = await storage.getAll()

  if (!extensionEnabled) {
    return
  }

  repeekNotification()

  observeBody()
  observeParasiteModalContainer()
})()
