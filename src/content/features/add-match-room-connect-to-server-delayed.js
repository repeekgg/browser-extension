/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getRoomId } from '../libs/match-room'

const store = new Map()

export default async parentElement => {
  const roomId = getRoomId()

  if (store.has(roomId)) {
    return
  }

  const goToServerElement = select(
    'a[translate-once="GO-TO-SERVER"]',
    parentElement
  )

  if (!goToServerElement) {
    return
  }

  store.set(roomId, true)

  let goToServerTimer

  const connectToServerDelayed = () => {
    if (goToServerTimer) {
      return
    }

    const timeLeftElement = select(
      'timer[countdown="vm.currentMatch.derived.warmupCountdown"]',
      parentElement
    )
    const timeLeft = timeLeftElement.textContent
    const [minutes, seconds] = timeLeft.split(':')
    const delay = Math.abs(60000 - (minutes * 60000 + seconds * 1000))

    goToServerTimer = setTimeout(() => {
      goToServerElement.click()
    }, delay)
  }

  const connectToServerDelayedElement = (
    <a
      className="btn btn-primary mt-md"
      onClick={e => {
        e.preventDefault()
        connectToServerDelayed()
        connectToServerDelayedElement.setAttribute('disabled', 'disabled')
        connectToServerDelayedElement.textContent =
          'Connecting at 1 Minute left'
      }}
      href="#"
    >
      Connect at 1 Minute left
    </a>
  )

  goToServerElement.parentElement.append(
    <div>{connectToServerDelayedElement}</div>
  )
}
