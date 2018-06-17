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
import createDeveloperLabelElement from '../components/developer-label'

const FEATURE_ATTRIBUTE = 'developer-label'

const developerIds = [
  'b144525f-8f41-4ea4-aade-77862b631bbc', // Azn
  'e5344dfd-94c2-4087-86e0-20f8c81fe4cb', // Zerosiris
  'a9f76105-4473-4870-a2c6-7f831e96edaf' // Poacher2k
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

      if (developerIds.indexOf(userId) === -1) {
        return
      }

      const developerLabelElement = createDeveloperLabelElement()

      const memberDetailsElement = select(
        '.match-team-member__details__name',
        memberElement
      )
      memberDetailsElement.insertAdjacentElement(
        'afterbegin',
        <div style={{ 'margin-top': 5 }}>{developerLabelElement}</div>
      )
    })
  })
}
