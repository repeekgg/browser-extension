import select from 'select-dom'
import { getRoomId, getTeamElements } from '../helpers/match-room'
import { notifyIf } from '../helpers/user-settings'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'
import { getSelf, getQuickMatch, getMatch } from '../helpers/faceit-api'

const FEATURE_ATTRIBUTE = 'connect-to-server'

const DELAY = 10000

export default async parent => {
  const goToServerElement = select('a[translate-once="GO-TO-SERVER"]', parent)

  if (!goToServerElement) {
    return
  }

  const { isTeamV1Element } = getTeamElements(parent)
  const roomId = getRoomId()
  const { teams } = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  const self = await getSelf()
  const isSelfInMatch = [
    ...teams.faction1.roster,
    ...teams.faction2.roster
  ].some(player => player.id === self.guid)

  if (!isSelfInMatch) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, goToServerElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, goToServerElement)

  const { matchRoomLastConnectToServer } = await storage.getAll()

  if (matchRoomLastConnectToServer === roomId) {
    return
  }

  storage.set({ matchRoomLastConnectToServer: roomId })

  setTimeout(() => {
    goToServerElement.click()
  }, DELAY)

  notifyIf('notifyMatchRoomAutoConnectToServer', {
    title: 'Connecting to Server',
    message: `Launching the game and connecting to the server in ${DELAY /
      1000} seconds.`
  })
}
