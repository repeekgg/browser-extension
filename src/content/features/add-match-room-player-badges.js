import React from 'dom-chef'
import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  getNicknameElement,
  mapMatchNicknamesToPlayersMemoized
} from '../helpers/match-room'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { getQuickMatch, getMatch } from '../helpers/faceit-api'
import { getPlayerBadges } from '../helpers/player-badges'
import createFeaturedPlayerBadgeElement from '../components/player-badge'

const FEATURE_ATTRIBUTE = 'player-badge'

const playerBadges = {}

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (!match) {
    return
  }

  const nicknamesToPlayers = mapMatchNicknamesToPlayersMemoized(match)

  if (!playerBadges[roomId]) {
    playerBadges[roomId] = getPlayerBadges(
      Object.values(nicknamesToPlayers).map(({ id }) => id)
    )
  }

  playerBadges[roomId] = await playerBadges[roomId]

  teamElements.forEach(async teamElement => {
    const factionDetails = getFactionDetails(teamElement, isTeamV1Element)

    if (!factionDetails) {
      return
    }

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }
      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent
      const player = nicknamesToPlayers[nickname]

      let userId
      if (isTeamV1Element) {
        userId = player.guid
      } else {
        userId = player.id
      }

      const playerBadge = playerBadges[roomId][userId]

      if (!playerBadge) {
        return
      }

      const featuredPlayerBadgeElement = createFeaturedPlayerBadgeElement(
        playerBadge
      )

      const memberDetailsElement = select(
        '.match-team-member__details__name',
        memberElement
      )
      memberDetailsElement.insertAdjacentElement(
        'afterbegin',
        <div style={{ 'margin-top': 5 }}>{featuredPlayerBadgeElement}</div>
      )
    })
  })
}
