import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import storage from '../../libs/storage'
import { notifyIf } from '../libs/utils'
import { getQuickMatch, getMatch, getSelf } from '../libs/faceit'
import { getRoomId, getTeamElements } from '../libs/match-room'

const FEATURE_ATTRIBUTE = 'veto-locations'
const VETO_DELAY = 2000

export default async parentElement => {
  const { isTeamV1Element } = getTeamElements(parentElement)
  const roomId = getRoomId()
  const { region, ...match } = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)
  const self = await getSelf()

  let faction1Leader
  let faction2Leader

  if (isTeamV1Element) {
    faction1Leader = match.faction1Leader
    faction2Leader = match.faction2Leader
  } else {
    faction1Leader = match.teams.faction1.leader
    faction2Leader = match.teams.faction2.leader
  }

  if (![faction1Leader, faction2Leader].includes(self.guid)) {
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

  const isVetoLocations = autoVetoItems.some(item =>
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

    autoVetoItems.some(item => {
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
