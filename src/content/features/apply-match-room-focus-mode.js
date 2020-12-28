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
  const { ...match } = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  const self = await getSelf()
  let isSelfInLobby = false

  if (match && match.teams) {
    if (match.teams.faction1 && match.teams.faction1.roster) {
      isSelfInLobby = match.teams.faction1.roster.some(player => {
        return player.id === self.guid
      })
    }
    if (!isSelfInLobby && match.teams.faction2 && match.teams.faction2.roster) {
      isSelfInLobby = match.teams.faction2.roster.some(player => {
        return player.id === self.guid
      })
    }
    if (!isSelfInLobby) {
      return
    }
  }

  const teamElements = select.all('match-team-v2', parent)

  teamElements.forEach(teamElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)) {
      return
    }
    setFeatureAttribute(FEATURE_ATTRIBUTE, teamElement)

    setStyle(teamElement, 'opacity: 0')
  })
}
