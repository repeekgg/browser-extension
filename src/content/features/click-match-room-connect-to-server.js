import select from 'select-dom'
import { getRoomId } from '../libs/match-room'
import { notifyIf } from '../libs/utils'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'connect-to-server'

const DELAY = 10000

export default async parent => {
  const goToServerElement = select('a[translate-once="GO-TO-SERVER"]', parent)

  if (!goToServerElement) {
    return
  }

  if (hasFeatureAttribute(goToServerElement, FEATURE_ATTRIBUTE)) {
    return
  }
  setFeatureAttribute(goToServerElement, FEATURE_ATTRIBUTE)

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
