import select from 'select-dom'
import copyToClipboard from 'copy-text-to-clipboard'
import { getTeamElements, getRoomId } from '../libs/match-room'
import { notifyIf } from '../libs/utils'

const store = new Map()

export default async parent => {
  const roomId = getRoomId()

  if (store.has(roomId)) {
    return
  }

  const { isTeamV1Element } = getTeamElements(parent)
  let serverConnectData

  if (isTeamV1Element) {
    const element = select('div[ng-if="serverConnectData.active"] span', parent)
    serverConnectData = element && element.textContent
  } else {
    const element = select(
      'input[ng-model="vm.currentMatch.derived.serverConnectData.clipboard.text"]',
      parent
    )
    serverConnectData = element && element.value
  }

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
