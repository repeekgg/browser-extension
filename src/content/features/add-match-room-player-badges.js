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

const FEATURE_ATTRIBUTE = 'featured-player-label'

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
const featuredPlayers = [
  /* eslint-disable capitalized-comments */
  addPlayer('b144525f-8f41-4ea4-aade-77862b631bbc', 'Creator'), // azn
  addPlayer('a9f76105-4473-4870-a2c6-7f831e96edaf', 'Developer'), // poacher2k
  addVIP('4d18a0d6-c6a1-4079-af4d-0d73dbdcc5cf'), // zwacki
  addVIP('ff0f31f0-b26a-47cf-ae44-09f8a0f65ddb'), // hAnnah_f
  addVIP('710970df-174c-4e4a-8267-e858b717f2cc'), // shiroatata
  addVIP('c40dcb07-36ab-4fea-82be-04d01b8d20de'), // ahGrizzly
  addVIP('bf64c6f0-7445-4c2e-9a89-e8377670676b'), // DinoH
  addVIP('c86192da-0af2-430e-ad9d-42118154922e'), // Odim
  addVIP('27d1a137-8bf2-4b21-844e-ff2b7131ae74'), // Swisher
  addVIP('d7638ee5-901a-4c94-aee8-e856325b51a0'), // roxxon
  addVIP('efcd8a5a-3a07-4b71-8a82-4f0b0ad4569d'), // wipseN
  addVIP('0ea79dd6-708e-44e5-adba-d2c5e906d42d'), // HPRski
  addVIP('2162170c-a008-455e-bb64-200a12bafa96'), // kamilyzer
  addVIP('c28cd3b7-9fbe-45e7-b30f-e22c43b58617'), // V3n0mTV
  addVIP('d3386053-26eb-403e-8a1b-96aaed775204'), // WaLLe
  addVIP('1d558e16-f936-4245-97bb-ca60955f15de'), // kaip1
  addVIP('e146a824-ea66-4aa7-bdcd-23000021b76a'), // mads-
  addVIP('c4c64927-5f68-4997-9d21-8e9a64646a20') // pyromania
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

      const featuredPlayer = featuredPlayers.find(({ id }) => id === userId)

      if (!featuredPlayer) {
        return
      }

      const { role, bgColor, textColor, description } = featuredPlayer

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
