import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import storage from '../../shared/storage'
import { notifyIf } from '../helpers/user-settings'
import { getMatch, getSelf } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'

const FEATURE_ATTRIBUTE = 'veto-locations'
const VETO_DELAY = 2000

export default async (parentElement) => {
  const roomId = getRoomId()
  const { region, ...match } = await getMatch(roomId)
  const self = await getSelf()

  if (
    ![match.teams.faction1.leader, match.teams.faction2.leader].includes(
      self.id
    )
  ) {
    return
  }

  const votingListElement = select(
    'div.match-vs__details > div.match-voting > div > democracy',
    parentElement
  )

  if (!votingListElement) {
    return
  }

  const { matchRoomAutoVetoLocationItems } = await storage.getAll()
  const autoVetoItems =
    matchRoomAutoVetoLocationItems[region] &&
    matchRoomAutoVetoLocationItems[region].reverse()

  if (!autoVetoItems) {
    return
  }

  const isVetoLocations = autoVetoItems.some((item) =>
    select.exists(`div[title="${item}"]`, votingListElement)
  )

  if (
    hasFeatureAttribute(FEATURE_ATTRIBUTE, votingListElement) ||
    !isVetoLocations
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, votingListElement)

  const autoVeto = () => {
    const isVetoTurn = select.exists('button', votingListElement)

    if (!isVetoTurn) {
      return
    }

    autoVetoItems.some((item) => {
      const vetoButtonElement = select(
        `div[title="${item}"] * button`,
        votingListElement
      )
      if (vetoButtonElement) {
        setTimeout(() => {
          vetoButtonElement.click()
        }, VETO_DELAY)
      }
      return Boolean(vetoButtonElement)
    })
  }

  autoVeto()

  const observer = new MutationObserver(() => {
    const vetoButtonElements = select.all('button', votingListElement)

    if ([2, 3].includes(vetoButtonElements.length)) {
      observer.disconnect()
    }

    autoVeto()
  })
  observer.observe(votingListElement, { childList: true, subtree: true })

  notifyIf('notifyMatchRoomAutoVetoLocations', {
    title: 'Match Server Locations Veto',
    message: 'Server locations will be vetoed automatically.'
  })
}
