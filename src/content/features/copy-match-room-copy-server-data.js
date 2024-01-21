import copyToClipboard from 'copy-text-to-clipboard'
import select from 'select-dom'
import { getRoomId } from '../helpers/match-room'
import { notifyIf } from '../helpers/user-settings'

const store = new Map()

const connectRegExp = /(connect \d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}:\d{1,5})/

export default async (parent) => {
  const roomId = getRoomId()

  if (store.has(roomId)) {
    return
  }

  const element = select('a[translate-once="GO-TO-SERVER"]', parent)

  if (!element) {
    return
  }

  const elementHref = element.getAttribute('href')
  const serverConnectData =
    elementHref && connectRegExp.exec(decodeURI(elementHref))

  if (!serverConnectData) {
    return
  }

  store.set(roomId, true)

  copyToClipboard(serverConnectData[1])

  notifyIf('notifyMatchRoomAutoCopyServerData', {
    title: 'Server Connect Data Copied',
    message: 'Server connect data has been copied to your clipboard.',
  })
}
