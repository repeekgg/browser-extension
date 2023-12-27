import select from 'select-dom'
import shuffle from 'lodash/shuffle'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'
import { notifyIf } from '../helpers/user-settings'
import { getMatch, getSelf } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'
import maps from '../helpers/maps'

const FEATURE_ATTRIBUTE = 'veto-maps'
const VETO_DELAY = 2000

export default async (parentElement) => {
  const roomId = getRoomId()
  const match = await getMatch(roomId)
  const self = await getSelf()

  if (
    ![match.teams.faction1.leader, match.teams.faction2.leader].includes(
      self.id
    )
  ) {
    return
  }

  const votingListElement = select(
    'div.match-vs__details > div.match-voting > div > democracy',
    parentElement
  )

  if (!votingListElement) {
    return
  }

  const {
    matchRoomAutoVetoMapItems,
    matchRoomAutoVetoMapsShuffle: shuffleMaps,
    matchRoomAutoVetoMapsShuffleAmount: shuffleMapsAmount,

    // Auto veto limit variables.
    matchRoomAutoVetoMapsLimit: vetoMapsLimit,
    matchRoomAutoVetoMapsLimitAmount: vetoMapsLimitAmount
  } = await storage.getAll()
  let autoVetoItems = matchRoomAutoVetoMapItems.map((m) => maps.csgo[m] || m)

  if (shuffleMaps) {
    const shuffledItems = shuffle(autoVetoItems.splice(0, shuffleMapsAmount))
    autoVetoItems.unshift(...shuffledItems)
  }

  autoVetoItems = autoVetoItems.reverse()

  const isVetoMaps = autoVetoItems.some((item) =>
    select.exists(`div[title="${item}"]`, votingListElement)
  )

  if (
    hasFeatureAttribute(FEATURE_ATTRIBUTE, votingListElement) ||
    !isVetoMaps
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, votingListElement)

  let vetoMapCounter = 0

  const autoVeto = () => {
    const isVetoTurn = select.exists('button', votingListElement)

    if (!isVetoTurn) {
      return
    }

    autoVetoItems.some((item) => {
      const vetoButtonElement = select(
        `div[title="${item}"] * button`,
        votingListElement
      )
      if (vetoButtonElement) {
        setTimeout(() => {
          /*
           * Added Auto Veto Limit:
           *
           * Default: vetoMapsLimit = false (No Limit on Veto)
           *          vetoMapsLimitAmount = 4 (Maximum a team can veto)
           *          vetoMapCounter = 1-4 (Keep a check on number of maps veteod)
           *
           * Logic: If vetoMapsLimit = false, auto veto maximum possible maps
           *        else check
           *             if counter <= set_value (default=4)
           *                auto veto and increment counter
           *             else just wait for player to veto.
           */
          if (vetoMapsLimit) {
            if (vetoMapCounter < vetoMapsLimitAmount) {
              vetoButtonElement.click()
              vetoMapCounter += 1
            }
          } else {
            vetoButtonElement.click()
          }
        }, VETO_DELAY)
      }
      return Boolean(vetoButtonElement)
    })
  }

  autoVeto()

  const observer = new MutationObserver(() => {
    const vetoButtonElements = select.all('button', votingListElement)

    if ([2, 3].includes(vetoButtonElements.length)) {
      observer.disconnect()
    }

    autoVeto()
  })
  observer.observe(votingListElement, { childList: true, subtree: true })

  notifyIf('notifyMatchRoomAutoVetoMaps', {
    title: 'Match Maps Veto',
    message: 'Maps will be vetoed automatically.'
  })
}
