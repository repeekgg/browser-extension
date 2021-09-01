import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { notifyIf } from '../helpers/user-settings'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'

const FEATURE_ATTRIBUTE = 'connect-to-server'

const DELAY = 10000

export default async parent => {
  const goToServerElement = select('a[translate-once="GO-TO-SERVER"]', parent)

  if (!goToServerElement) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, goToServerElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, goToServerElement)

  const { matchRoomLastConnectToServer } = await storage.getAll()
  const roomId = getRoomId()

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
