import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  getNicknameElement,
  mapMatchNicknamesToPlayersMemoized
} from '../libs/match-room'

import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'
import { getQuickMatch, getMatch, getPlayerDivision } from '../libs/faceit'
import createDivisionElement from '../components/division'

const FEATURE_ATTRIBUTE = 'player-divisions'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (!match) {
    return
  }

  const { game, region } = match

  const nicknamesToPlayers = mapMatchNicknamesToPlayersMemoized(match)

  teamElements.forEach(async teamElement => {
    const factionDetails = getFactionDetails(teamElement, isTeamV1Element)

    if (!factionDetails) {
      return
    }

    const { isFaction1 } = factionDetails

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }

      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const skillElement = select(
        '.match-team-member__details__skill',
        memberElement
      )

      const leagueIcon = select('league-icon', memberElement)

      if (leagueIcon) {
        return
      }

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent
      const player = nicknamesToPlayers[nickname]

      let userId
      if (isTeamV1Element) {
        userId = player.guid
      } else {
        userId = player.id
      }

      const division = await getPlayerDivision(userId, game, region)

      const divisionElement = createDivisionElement({
        division,
        alignRight: isFaction1,
        style: {
          height: '32px',
          width: '32px',
          [`margin-${isFaction1 ? 'left' : 'right'}`]: 4
        }
      })

      setStyle(skillElement, 'display: flex')
      skillElement[isFaction1 ? 'append' : 'prepend'](divisionElement)
    })
  })
}
