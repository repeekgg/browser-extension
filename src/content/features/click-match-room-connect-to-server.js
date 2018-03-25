import select from 'select-dom'
import { getRoomId } from '../libs/match-room'
import { notifyIf } from '../libs/utils'

const store = new Map()

const DELAY = 10000

export default async parent => {
  const roomId = getRoomId()

  if (store.has(roomId)) {
    return
  }

  const goToServerElement = select('a[translate-once="GO-TO-SERVER"]', parent)

  if (!goToServerElement) {
    return
  }

  store.set(roomId, true)

  setTimeout(() => {
    goToServerElement.click()
  }, DELAY)

  notifyIf('notifyMatchRoomAutoConnectToServer', {
    title: 'Connecting to Server',
    message: `Launching the game and connecting to the server in ${DELAY /
      1000} seconds.`
  })
}
