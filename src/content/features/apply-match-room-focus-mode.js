import select from 'select-dom'
import { getMatchState, getRoomId } from '../helpers/match-room'
import { getSelf, getPlayerMatches } from '../helpers/faceit-api'
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

  const self = await getSelf()
  const game = self.flag

  const matches = await getPlayerMatches(self.guid, game)
  const roomId = getRoomId()

  if (!matches.some(match => match.matchId === roomId)) {
    return
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
