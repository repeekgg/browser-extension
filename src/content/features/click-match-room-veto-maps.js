import select from 'select-dom'
import shuffle from 'lodash/shuffle'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'
import { getMatch, getSelf } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'
import maps from '../helpers/maps'

const FEATURE_ATTRIBUTE = 'veto-maps'
const VETO_DELAY = 5000

export default async () => {
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

  const matchRoomInfoColumnElement = select(
    '#MATCHROOM-OVERVIEW div[name="info"]'
  )

  if (!matchRoomInfoColumnElement) {
    return
  }

  const vetoListElements = select.all(
    'div:has(> div > div):has(> div > span):has(> div > button)',
    matchRoomInfoColumnElement
  )

  if (!vetoListElements?.length) {
    return
  }

  const {
    matchRoomAutoVetoMapItems,
    matchRoomAutoVetoMapsShuffle: shuffleMaps,
    matchRoomAutoVetoMapsShuffleAmount: shuffleMapsAmount
  } = await storage.getAll()
  let autoVetoItems = matchRoomAutoVetoMapItems.map(m => maps.csgo[m] || m)

  const isVetoMaps = vetoListElements.some(vetoListElement =>
    autoVetoItems.some(
      autoVetoItem =>
        autoVetoItem === select('span', vetoListElement)?.innerText
    )
  )

  if (
    !isVetoMaps ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomInfoColumnElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomInfoColumnElement)

  if (shuffleMaps) {
    const shuffledItems = shuffle(autoVetoItems.splice(0, shuffleMapsAmount))
    autoVetoItems.unshift(...shuffledItems)
  }

  autoVetoItems = autoVetoItems.reverse()

  const observer = new MutationObserver(() => {
    if (
      !select.all(
        'div:has(> div > div):has(> div > span):has(> div > button)',
        matchRoomInfoColumnElement
      )?.length
    ) {
      observer.disconnect()
      return
    }

    const isOpponentTurn = vetoListElements.some(vetoListElement =>
      select('button', vetoListElement)?.hasAttribute('disabled')
    )

    if (isOpponentTurn) {
      return
    }

    return autoVetoItems.some(autoVetoItem => {
      const vetoItemElement = vetoListElements.find(
        vetoListElement =>
          select('span', vetoListElement)?.innerText === autoVetoItem
      )

      const vetoItemBanButtonElement = select('button', vetoItemElement)

      if (!vetoItemBanButtonElement) {
        return false
      }

      setTimeout(() => {
        vetoItemBanButtonElement.click()
      }, VETO_DELAY)

      return true
    })
  })

  observer.observe(matchRoomInfoColumnElement, {
    childList: true,
    subtree: true
  })
}
