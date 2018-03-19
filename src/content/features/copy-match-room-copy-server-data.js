import select from 'select-dom'
import get from 'lodash.get'
import copyToClipboard from 'copy-text-to-clipboard'
import { getRoomId } from '../libs/match-room'
import { notifyIf } from '../libs/utils'

const store = new Map()

export default async parent => {
  const roomId = getRoomId()

  if (store.has(roomId)) {
    return
  }

  const element = select('span[translate="IN-CASE-OF-FPS-DROPS"]', parent)

  if (!element) {
    return
  }

  const matchData = element.getAttribute('translate-values')
  const serverConnectData = get(JSON.parse(matchData), 'server.clipboard.text')

  if (!serverConnectData) {
    return
  }

  store.set(roomId, true)

  copyToClipboard(serverConnectData)

  notifyIf('notifyMatchRoomAutoConnectToServer', {
    title: 'Server Connect Data Copied',
    message: 'Server connect data has been copied to your clipboard.'
  })
}
