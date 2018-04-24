import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  mapPlayersToPartyColorsMemoized
} from '../libs/match-room'
import { getQuickMatch, getMatch } from '../libs/faceit'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'player-color'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  if (!isTeamV1Element) {
    return
  }

  const roomId = getRoomId()
  const { matchType, ...match } = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (matchType === '5v5PREMADE') {
    return
  }

  teamElements.forEach(async teamElement => {
    const { factionName, isFaction1 } = getFactionDetails(
      teamElement,
      isTeamV1Element
    )

    const faction = match[factionName]

    const playerColors = mapPlayersToPartyColorsMemoized(faction, isFaction1)

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }

      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const nickname = select(
        `strong[ng-bind="::teamMember.nickname"]`,
        memberElement
      ).textContent

      setStyle(memberElement, [
        `border-${isFaction1 ? 'left' : 'right'}: 2px solid ${
          playerColors[nickname]
        }`,
        'border-radius: 0'
      ])
    })
  })
}
