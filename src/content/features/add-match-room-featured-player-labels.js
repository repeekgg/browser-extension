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
import createFeaturedPlayerLabelElement from '../components/featured-player-label'

const FEATURE_ATTRIBUTE = 'featured-player-label'

function addPlayer(id, role, bgColor, textColor) {
  return { id, role, bgColor, textColor }
}

function addDeveloper(id) {
  return addPlayer(id, 'Developer')
}

function addDonator(id) {
  return addPlayer(id, 'Donator', '#ffe119', '#000')
}

// Get player guid:
// https://api.faceit.com/core/v1/nicknames/<nickname>
const featuredPlayers = [
  /* eslint-disable capitalized-comments */
  addPlayer('b144525f-8f41-4ea4-aade-77862b631bbc', 'Creator'), // azn
  addDeveloper('a9f76105-4473-4870-a2c6-7f831e96edaf'), // poacher2k
  addDonator('4d18a0d6-c6a1-4079-af4d-0d73dbdcc5cf'), // zwacki
  addDonator('ff0f31f0-b26a-47cf-ae44-09f8a0f65ddb'), // hAnnah_f
  addDonator('710970df-174c-4e4a-8267-e858b717f2cc'), // shiroatata
  addDonator('c40dcb07-36ab-4fea-82be-04d01b8d20de'), // ahGrizzly
  addDonator('bf64c6f0-7445-4c2e-9a89-e8377670676b'), // DinoH
  addDonator('c86192da-0af2-430e-ad9d-42118154922e'), // Odim
  addDonator('27d1a137-8bf2-4b21-844e-ff2b7131ae74'), // Swisher
  addDonator('d7638ee5-901a-4c94-aee8-e856325b51a0'), // roxxon
  addDonator('efcd8a5a-3a07-4b71-8a82-4f0b0ad4569d'), // wipseN
  addDonator('0ea79dd6-708e-44e5-adba-d2c5e906d42d'), // HPRski
  addDonator('89464037-3752-4c5b-b998-aca7bf941ba5') // KROKODEALZ
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

      const { role, bgColor, textColor } = featuredPlayer

      const featuredPlayerLabelElement = createFeaturedPlayerLabelElement({
        role,
        bgColor,
        textColor
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
