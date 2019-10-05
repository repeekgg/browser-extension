import select from 'select-dom'
import { getMatchState } from '../libs/match-room'
import {
  setStyle,
  hasFeatureAttribute,
  setFeatureAttribute
} from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'focus-mode'

export default async parent => {
  const matchState = getMatchState(parent)

  if (!['VOTING', 'CONFIGURING', 'READY', 'ONGOING'].includes(matchState)) {
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
