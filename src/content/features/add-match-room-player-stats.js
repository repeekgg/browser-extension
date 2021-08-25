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
import { getQuickMatch, getMatch, getPlayerStats } from '../helpers/faceit-api'
import createPlayerStatsElement from '../components/player-stats'

const FEATURE_ATTRIBUTE = 'player-stats'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (!match) {
    return
  }

  const { game } = match

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

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent
      const player = nicknamesToPlayers[nickname]

      let userId
      if (isTeamV1Element) {
        userId = player.guid
      } else {
        userId = player.id
      }

      let stats = await getPlayerStats(userId, game)

      if (!stats) {
        // Set stats to default 0 instead of not loading the UI.
        stats = {
          matches: '--',
          winRate: 0,
          averageKDRatio: 0.0,
          averageKRRatio: 0.0,
          averageHeadshots: 0,
          averageKills: 0
        }
      }

      const statsElement = createPlayerStatsElement({
        ...stats,
        alignRight: !isFaction1
      })

      const memberDetailsElement = select(
        '.match-team-member__details',
        memberElement
      )
      memberDetailsElement.after(statsElement)
    })
  })
}
