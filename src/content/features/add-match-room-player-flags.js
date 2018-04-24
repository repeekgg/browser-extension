import {
  getTeamElements,
  getFactionDetails,
  getTeamMemberElements,
  getNicknameElement
} from '../libs/match-room'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getPlayer } from '../libs/faceit'
import createFlagElement from '../components/flag'

const FEATURE_ATTRIBUTE = 'country-flag'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  teamElements.forEach(async teamElement => {
    const { isFaction1 } = getFactionDetails(teamElement, isTeamV1Element)

    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }

      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent

      const player = await getPlayer(nickname)

      if (player) {
        const { country } = player
        const flag = createFlagElement({ country, alignRight: !isFaction1 })
        nicknameElement[isFaction1 ? 'prepend' : 'append'](flag)
      }
    })
  })
}
