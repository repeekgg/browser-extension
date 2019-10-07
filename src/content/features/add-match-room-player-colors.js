import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  mapPlayersToPartyColorsMemoized
} from '../helpers/match-room'
import { getQuickMatch, getMatch } from '../helpers/faceit-api'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'player-color'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const { matchType, ...match } = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (matchType === '5v5PREMADE') {
    return
  }

  teamElements.forEach(async teamElement => {
    const factionDetails = getFactionDetails(teamElement, isTeamV1Element)

    if (!factionDetails) {
      return
    }

    const { isFaction1 } = factionDetails

    const playerColors = mapPlayersToPartyColorsMemoized(
      match,
      isTeamV1Element,
      factionDetails
    )

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }

      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const nicknameSelector = isTeamV1Element
        ? `strong[ng-bind="::teamMember.nickname"]`
        : `strong[ng-bind="vm.teamMember.nickname"]`
      const nickname = select(nicknameSelector, memberElement).textContent

      setStyle(memberElement, [
        `border-${isFaction1 ? 'left' : 'right'}: 2px solid ${
          playerColors[nickname]
        }`,
        'border-radius: 0'
      ])
    })
  })
}
