/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getHubQueue } from '../libs/faceit'

const FEATURE_ATTRIBUTE = 'hub-queuing'

export default async () => {
  const hubsElementSelector = 'div[ng-if="vm.userCompStore.hubs.length"]'
  const hubsElement = select(hubsElementSelector)

  if (!hubsElement) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, hubsElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, hubsElement)

  const queueElements = select.all('navigation-hub-line > div', hubsElement)

  const updateIntervals = []

  queueElements.forEach(async queueElement => {
    queueElement.classList.add('--tall-line')

    const mainElement = select('.side-menu-line-main', queueElement)

    const href = mainElement.getAttribute('href')
    const regExpMatch = /\/hub\/([0-9a-z-]+)\//.exec(href)

    if (!regExpMatch) {
      return
    }

    const [hubId] = regExpMatch.shift() && regExpMatch

    const { noOfPlayers } = await getHubQueue(hubId)

    const numberQueuingElement = <span>{noOfPlayers}</span>

    const queuingElement = (
      <div className="text-truncate block text-nav-gray" id="queuing">
        {numberQueuingElement} queuing
      </div>
    )

    const textElement = select('.side-menu-line__text', mainElement)
    textElement.append(queuingElement)

    updateIntervals.push(
      setInterval(async () => {
        numberQueuingElement.textContent = await getHubQueue(hubId)
      }, 120000)
    )
  })

  const observer = new MutationObserver(() => {
    if (!select.exists(hubsElementSelector)) {
      updateIntervals.forEach(interval => clearInterval(interval))
      observer.disconnect()
    }
  })

  observer.observe(hubsElement.parentElement, { childList: true })
}
