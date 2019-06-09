/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getFactionDetails,
  getTeamMemberElements,
  getNicknameElement,
  mapMatchNicknamesToPlayersMemoized
} from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getQuickMatch, getMatch } from '../libs/faceit'
import createFeaturedPlayerBadgeElement from '../components/player-badge'
import storage from '../../libs/storage'

const FEATURE_ATTRIBUTE = 'player-badge'

function addPlayer(id, role, bgColor, textColor, description, onClick) {
  return { id, role, bgColor, textColor, description, onClick }
}

function addVIP({
  guid,
  role = 'VIP',
  bgColor = '#0082c8',
  textColor = '#fff',
  special = false
}) {
  return addPlayer(
    guid,
    special ? `VIP ★` : role,
    special ? '#ffe119' : bgColor,
    special ? '#000' : textColor,
    `Has donated${special ? ' the most ' : ' '}to support the development.`
  )
}

let playerBadges

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  if (!match) {
    return
  }

  if (!playerBadges) {
    const { vips } = await storage.getAll()
    playerBadges = [
      /* eslint-disable capitalized-comments */
      addPlayer('b144525f-8f41-4ea4-aade-77862b631bbc', 'Creator'), // azn
      addPlayer('a9f76105-4473-4870-a2c6-7f831e96edaf', 'Developer'), // poacher2k
      ...vips.map(addVIP)
      /* eslint-enable capitalized-comments */
    ]
  }

  const nicknamesToPlayers = mapMatchNicknamesToPlayersMemoized(match)

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

      const playerBadge = playerBadges.find(({ id }) => id === userId)

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
