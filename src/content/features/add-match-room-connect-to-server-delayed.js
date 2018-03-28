/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'connect-to-server-delayed'

export default async parentElement => {
  const matchDetailsElement = select('div.match-vs__details', parentElement)

  if (!matchDetailsElement) {
    return
  }

  const goToServerElement = select(
    'a[translate-once="GO-TO-SERVER"]',
    matchDetailsElement
  )

  if (
    !goToServerElement ||
    hasFeatureAttribute(goToServerElement, FEATURE_ATTRIBUTE)
  ) {
    return
  }

  setFeatureAttribute(goToServerElement, FEATURE_ATTRIBUTE)

  let goToServerTimer

  const connectToServerDelayedElement = (
    <a
      className="btn btn-primary mt-md"
      onClick={e => {
        e.preventDefault()

        if (goToServerTimer) {
          return
        }

        connectToServerDelayedElement.setAttribute('disabled', 'disabled')

        const timeLeftElement = select('timer', matchDetailsElement)

        if (!timeLeftElement) {
          connectToServerDelayedElement.textContent =
            'Error: Something went wrong :('
        }

        const timeLeft = timeLeftElement.textContent
        const [minutes, seconds] = timeLeft.split(':')
        const delay = minutes * 60000 + seconds * 1000 - 60000

        if (delay < 60000) {
          connectToServerDelayedElement.textContent =
            'Not Connecting: Less than 1 Minute Left'
          return
        }

        connectToServerDelayedElement.textContent =
          'Connecting at 1 Minute left ...'

        goToServerTimer = setTimeout(() => {
          goToServerElement.click()
        }, delay)
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
