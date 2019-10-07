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
  setFeatureAttribute,
  setStyle
} from '../helpers/dom-element'
import { getQuickMatch, getMatch, getUser } from '../helpers/faceit'
import createEloElement from '../components/elo'

const FEATURE_ATTRIBUTE = 'player-elo'

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

      const user = await getUser(userId)

      if (!user) {
        return
      }

      const elo = user.games[game].faceitElo || '–'

      const eloElement = createEloElement({
        elo,
        alignRight: isFaction1,
        style: {
          [`margin-${isFaction1 ? 'right' : 'left'}`]: 4
        }
      })

      const skillElement = select(
        '.match-team-member__details__skill',
        memberElement
      )
      setStyle(skillElement, 'display: flex')
      skillElement.classList.add('text-muted', 'text-md')
      skillElement[isFaction1 ? 'prepend' : 'append'](eloElement)
    })
  })
}
