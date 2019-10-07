import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { notifyIf } from '../helpers/utils'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

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

  const connectedToServer =
    JSON.parse(localStorage.getItem('faceitEnhancer.connectedToServer')) || []

  const roomId = getRoomId()

  if (connectedToServer.includes(roomId)) {
    return
  }

  setTimeout(() => {
    goToServerElement.click()

    connectedToServer.push(roomId)
    localStorage.setItem(JSON.stringify(connectedToServer))
  }, DELAY)

  notifyIf('notifyMatchRoomAutoConnectToServer', {
    title: 'Connecting to Server',
    message: `Launching the game and connecting to the server in ${DELAY /
      1000} seconds.`
  })
}
