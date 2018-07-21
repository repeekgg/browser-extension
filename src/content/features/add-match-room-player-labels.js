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

const FEATURE_ATTRIBUTE = 'player-label'

function addPlayer(id, role) {
  return { id, role }
}

function addDeveloper(id) {
  return addPlayer(id, 'Developer')
}

function addSupporter(id) {
  return addPlayer(id, 'Supporter')
}

// Get player guid:
// https://api.faceit.com/core/v1/nicknames/<nickname>
const featuredPlayers = [
  /* eslint-disable capitalized-comments */
  addPlayer('b144525f-8f41-4ea4-aade-77862b631bbc', 'Creator'), // azn
  addDeveloper('e5344dfd-94c2-4087-86e0-20f8c81fe4cb'), // zerosiris
  addDeveloper('a9f76105-4473-4870-a2c6-7f831e96edaf'), // poacher2k
  addSupporter('4d18a0d6-c6a1-4079-af4d-0d73dbdcc5cf'), // zwacki
  addSupporter('ff0f31f0-b26a-47cf-ae44-09f8a0f65ddb') // hAnnah_f
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

      const featuredPlayerLabelElement = createFeaturedPlayerLabelElement({
        role: featuredPlayer.role
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
