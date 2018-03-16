import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  getNicknameElement
} from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getQuickMatch, getMatch, getPlayer } from '../libs/faceit'

const FEATURE_ATTRIBUTE = 'player-elo'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element ? getQuickMatch(roomId) : getMatch(roomId)

  teamElements.forEach(async teamElement => {
    const { isFaction1 } = getFactionDetails(teamElement, isTeamV1Element)

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(memberElement, FEATURE_ATTRIBUTE)) {
        return
      }

      setFeatureAttribute(memberElement, FEATURE_ATTRIBUTE)

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent

      const player = await getPlayer(nickname)

      if (!player) {
        return
      }

      const { game } = await match
      const elo = player.games[game].faceitElo || '–'

      const skillElement = select(
        '.match-team-member__details__skill',
        memberElement
      )
      skillElement.classList.add('text-muted', 'text-md')
      skillElement[isFaction1 ? 'prepend' : 'append'](elo)
    })
  })
}
