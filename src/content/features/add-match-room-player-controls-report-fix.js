import select from 'select-dom'
import { getTeamElements, getTeamMemberElements } from '../helpers/match-room'

import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../helpers/dom-element'

const FEATURE_ATTRIBUTE = 'player-controls-report-fix'

export default async parent => {
  const { teamElements } = getTeamElements(parent)

  teamElements.forEach(async teamElement => {
    const memberElements = getTeamMemberElements(teamElement)

    memberElements.forEach(async memberElement => {
      if (hasFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)) {
        return
      }

      setFeatureAttribute(FEATURE_ATTRIBUTE, memberElement)

      const controlsElement = select(
        '.match-team-member__controls',
        memberElement
      )

      // The [The report box pops up twice](https://github.com/faceit-enhancer/faceit-enhancer/issues/18) issue
      // is actually just the report box being nested under the controls element with position: absolute
      // and when the controls element are hidden on mouse leave, the next relative element is the body
      // therefore it seems like the report box is popping up in the top left corner
      controlsElement.addEventListener('click', () => {
        setStyle(controlsElement, 'display: flex')

        const handleMouseEnter = () => {
          controlsElement.style.display = ''
          controlsElement.removeEventListener('mouseenter', handleMouseEnter)
        }
        controlsElement.addEventListener('mouseenter', handleMouseEnter)
      })
    })
  })
}
