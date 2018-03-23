import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import storage from '../../libs/storage'
import { notifyIf } from '../libs/utils'

const FEATURE_ATTRIBUTE = 'veto'
const VETO_DELAY = 2000

export default async parent => {
  const votingListElement = select(
    'div.match-vs__details > div.match-voting > ul',
    parent
  )

  if (
    !votingListElement ||
    hasFeatureAttribute(votingListElement, FEATURE_ATTRIBUTE)
  ) {
    return
  }

  setFeatureAttribute(votingListElement, FEATURE_ATTRIBUTE)

  const { matchRoomAutoVetoMapItems } = await storage.getAll()
  const autoVetoItems = matchRoomAutoVetoMapItems.reverse()

  let notificationSent = false

  const observer = new MutationObserver(() => {
    const isVetoTurn = select.exists('button', votingListElement)

    if (!isVetoTurn) {
      return
    }

    let vetoButtonElement

    autoVetoItems.some(item => {
      const vetoItemElement = select(`div[title="${item}"]`)
      vetoButtonElement = select('button', vetoItemElement.parentNode)
      return Boolean(vetoItemElement) && Boolean(vetoButtonElement)
    })

    if (!vetoButtonElement) {
      return
    }

    setTimeout(() => {
      vetoButtonElement.click()
    }, VETO_DELAY)

    if (!notificationSent) {
      notificationSent = true
      notifyIf('notifyMatchRoomAutoVetoMaps', {
        title: 'Match Veto',
        message: 'Maps will be vetoed automatically.'
      })
    }
  })

  observer.observe(votingListElement, { childList: true, subtree: true })
}
