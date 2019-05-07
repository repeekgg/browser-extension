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
import createFeaturedPlayerLabelElement from '../components/player-badge'
import vips from '../vips'

const FEATURE_ATTRIBUTE = 'player-badge'

function addPlayer(id, role, bgColor, textColor, description) {
  return { id, role, bgColor, textColor, description }
}

function addVIP(id) {
  return addPlayer(
    id,
    'VIP',
    '#ffe119',
    '#000',
    'Has donated to support the development.'
  )
}

// Get player guid:
// https://api.faceit.com/core/v1/nicknames/<nickname>
const playerBadges = [
  /* eslint-disable capitalized-comments */
  addPlayer('b144525f-8f41-4ea4-aade-77862b631bbc', 'Creator'), // azn
  addPlayer('a9f76105-4473-4870-a2c6-7f831e96edaf', 'Developer'), // poacher2k
  addPlayer(
    '0ea79dd6-708e-44e5-adba-d2c5e906d42d',
    'VIP 🍆💦',
    '#FF69B4',
    undefined,
    'Has donated to support the development.'
  ), // HPRski
  ...vips.map(({ guid }) => addVIP(guid))
  /* eslint-enable capitalized-comments */
]

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

      const { role, bgColor, textColor, description } = playerBadge

      const featuredPlayerLabelElement = createFeaturedPlayerLabelElement({
        role,
        bgColor,
        textColor,
        description
      })

      const memberDetailsElement = select(
        '.match-team-member__details__name',
        memberElement
      )
      memberDetailsElement.insertAdjacentElement(
        'afterbegin',
        <div style={{ 'margin-top': 5, 'margin-bottom': 3 }}>
          {featuredPlayerLabelElement}
        </div>
      )
    })
  })
}
