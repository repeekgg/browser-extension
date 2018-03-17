import select from 'select-dom'
import { getRoomId } from '../libs/match-room'

export default async parent => {
  const goToServerButton = select('a[translate-once="GO-TO-SERVER"]', parent)

  if (goToServerButton) {
    const roomId = getRoomId()
    const storageKey = `${roomId}_go_to_server_button_clicked`

    if (sessionStorage.getItem(storageKey)) {
      return
    }

    setTimeout(() => {
      sessionStorage.setItem(storageKey, true)
      goToServerButton.click()
    }, 5000)
  }
}
