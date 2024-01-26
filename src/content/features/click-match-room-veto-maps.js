import arrayShuffle from 'array-shuffle'
import select from 'select-dom'
import storage from '../../shared/storage'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getMatch, getSelf } from '../helpers/faceit-api'
import maps from '../helpers/maps'
import { getRoomId } from '../helpers/match-room'
import { notifyIf } from '../helpers/user-settings'

const FEATURE_ATTRIBUTE = 'veto-maps'
const VETO_DELAY = 2000

export default async (parentElement) => {
  const roomId = getRoomId()
  const match = await getMatch(roomId)
  const self = await getSelf()

  if (
    ![match.teams.faction1.leader, match.teams.faction2.leader].includes(
      self.id,
    )
  ) {
    return
  }

  const votingListElement = select(
    'div.match-vs__details > div.match-voting > div > democracy',
    parentElement,
  )

  if (!votingListElement) {
    return
  }

  const {
    matchRoomAutoVetoMapItems,
    matchRoomAutoVetoMapsShuffle: shuffleMaps,
    matchRoomAutoVetoMapsShuffleAmount: shuffleMapsAmount,
  } = await storage.getAll()
  let autoVetoItems = matchRoomAutoVetoMapItems.map((m) => maps.csgo[m] || m)

  if (shuffleMaps) {
    const shuffledItems = arrayShuffle(
      autoVetoItems.splice(0, shuffleMapsAmount),
    )
    autoVetoItems.unshift(...shuffledItems)
  }

  autoVetoItems = autoVetoItems.reverse()

  const isVetoMaps = autoVetoItems.some((item) =>
    select.exists(`div[title="${item}"]`, votingListElement),
  )

  if (
    hasFeatureAttribute(FEATURE_ATTRIBUTE, votingListElement) ||
    !isVetoMaps
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, votingListElement)

  const autoVeto = () => {
    const isVetoTurn = select.exists('button', votingListElement)

    if (!isVetoTurn) {
      return
    }

    autoVetoItems.some((item) => {
      const vetoButtonElement = select(
        `div[title="${item}"] * button`,
        votingListElement,
      )
      if (vetoButtonElement) {
        setTimeout(() => {
          vetoButtonElement.click()
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
    message: 'Maps will be vetoed automatically.',
  })
}
