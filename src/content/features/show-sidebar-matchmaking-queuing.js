/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getQuickMatchPlayers } from '../libs/faceit'

const FEATURE_ATTRIBUTE = 'matchmaking-queuing'

export default async () => {
  const matchmakingElementSelector =
    'div[ng-if*="vm.userMatchmakingStore.matchmaking.length"]'
  const matchmakingElement = select(matchmakingElementSelector)

  if (!matchmakingElement) {
    return
  }

  if (hasFeatureAttribute(matchmakingElement, FEATURE_ATTRIBUTE)) {
    return
  }
  setFeatureAttribute(matchmakingElement, FEATURE_ATTRIBUTE)

  const queueElements = select.all(
    'navigation-queue-line > div',
    matchmakingElement
  )

  const updateIntervals = []

  queueElements.forEach(async queueElement => {
    queueElement.classList.add('--tall-line')

    const mainElement = select('.side-menu-line-main', queueElement)

    const href = mainElement.getAttribute('href')
    const match = /\/queue\/([a-z]+)\/([A-Z]+)\/([a-zA-Z0-9]+)$/.exec(href)

    if (!match) {
      return
    }

    const [game, region, matchType] = match.shift() && match

    const quickMatchPlayers = await getQuickMatchPlayers(
      game,
      region,
      matchType
    )

    const numberQueuingElement = <span>{quickMatchPlayers}</span>

    const queuingElement = (
      <div className="text-truncate block text-nav-gray" id="queuing">
        {numberQueuingElement} queuing
      </div>
    )

    const textElement = select('.side-menu-line__text', mainElement)
    textElement.append(queuingElement)

    updateIntervals.push(
      setInterval(async () => {
        numberQueuingElement.textContent = await getQuickMatchPlayers(
          game,
          region,
          matchType
        )
      }, 120000)
    )
  })

  const observer = new MutationObserver(() => {
    if (!select.exists(matchmakingElementSelector)) {
      updateIntervals.forEach(interval => clearInterval(interval))
      observer.disconnect()
    }
  })

  observer.observe(matchmakingElement.parentElement, { childList: true })
}
