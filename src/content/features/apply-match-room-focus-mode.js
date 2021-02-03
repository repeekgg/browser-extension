import select from 'select-dom'
import {
  getMatchState,
  getRoomId,
  getTeamElements
} from '../helpers/match-room'
import { getSelf, getQuickMatch, getMatch } from '../helpers/faceit-api'
import {
  setStyle,
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'focus-mode'

export default async parent => {
  const matchState = getMatchState(parent)

  if (!['VOTING', 'CONFIGURING', 'READY', 'ONGOING'].includes(matchState)) {
    return
  }

  const { isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const { teams } = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  const self = await getSelf()
  const isSelfInLobby = [
    ...teams.faction1.roster,
    ...teams.faction2.roster
  ].some(player => player.id === self.guid)

  if (!isSelfInLobby) {
    return
  }

  const balanceIndicatorElement = select('.match__team-balance', parent)
  if (
    balanceIndicatorElement &&
    hasFeatureAttribute(FEATURE_ATTRIBUTE, balanceIndicatorElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, balanceIndicatorElement)
  setStyle(balanceIndicatorElement, 'opacity: 0')

  const teamElements = select.all('match-team-v2', parent)

  teamElements.forEach(teamElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)) {
      return
    }
    setFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)

    setStyle(teamElement, 'opacity: 0')
  })
}
