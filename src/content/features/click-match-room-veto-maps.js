import select from 'select-dom'
import shuffle from 'lodash/shuffle'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'
import { notifyIf } from '../helpers/user-settings'
import { getQuickMatch, getMatch, getSelf } from '../helpers/faceit-api'
import { getRoomId, getTeamElements } from '../helpers/match-room'
import maps from '../helpers/maps'

const FEATURE_ATTRIBUTE = 'veto-maps'
const VETO_DELAY = 2000

export default async parentElement => {
  const { isTeamV1Element } = getTeamElements(parentElement)
  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)
  const self = await getSelf()

  let faction1Leader
  let faction2Leader

  if (isTeamV1Element) {
    faction1Leader = match.faction1Leader
    faction2Leader = match.faction2Leader
  } else {
    faction1Leader = match.teams.faction1.leader
    faction2Leader = match.teams.faction2.leader
  }

  if (![faction1Leader, faction2Leader].includes(self.guid)) {
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
    matchRoomAutoVetoMapsLimit: vetoMapsLimit,
    matchRoomAutoVetoMapsLimitAmount: vetoMapsLimitAmount
  } = await storage.getAll()
  let autoVetoItems = matchRoomAutoVetoMapItems.map(m => maps.csgo[m] || m)

  if (shuffleMaps) {
    const shuffledItems = shuffle(autoVetoItems.splice(0, shuffleMapsAmount))
    autoVetoItems.unshift(...shuffledItems)
  }

  autoVetoItems = autoVetoItems.reverse()

  const isVetoMaps = autoVetoItems.some(item =>
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

    autoVetoItems.some(item => {
      const vetoButtonElement = select(
        `div[title="${item}"] * button`,
        votingListElement
      )
      if (vetoButtonElement) {
        setTimeout(() => {
          if (vetoMapCounter < vetoMapsLimitAmount) {
            vetoButtonElement.click()
            if (vetoMapsLimit) {
              vetoMapCounter += 1
            }
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
