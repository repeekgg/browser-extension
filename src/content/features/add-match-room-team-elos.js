/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getIsFaction1,
  FACTION_1,
  FACTION_2
} from '../libs/match-room'
import { getQuickMatch, getMatch } from '../libs/faceit'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'
import { calculateRatingChange } from '../libs/elo'

const FEATURE_ATTRIBUTE = 'team-elo'

export default async parent => {
  const factionNicknameElements = select.all(
    `section.match__info-box h2`,
    parent
  )

  const roomId = getRoomId()
  const { isTeamV1Element } = getTeamElements(parent)
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  factionNicknameElements.forEach(async factionNicknameElement => {
    if (hasFeatureAttribute(factionNicknameElement, FEATURE_ATTRIBUTE)) {
      return
    }
    setFeatureAttribute(factionNicknameElement, FEATURE_ATTRIBUTE)

    const isFaction1 = getIsFaction1(
      factionNicknameElement.getAttribute('ng-bind')
    )
    const faction = isFaction1 ? FACTION_1 : FACTION_2

    const elo = match[`${faction}Elo`]
    const eloDiff = elo - match[`${isFaction1 ? FACTION_2 : FACTION_1}Elo`]
    const { winPoints, lossPoints } = calculateRatingChange(
      match[`${faction}Score`]
    )

    const eloElement = (
      <div className="text-muted text-md" style={{ 'margin-top': 6 }}>
        Avg. Elo: {elo} / Diff: {eloDiff > 0 && '+'}
        {eloDiff}
        <br />
        <span>Win: +{winPoints}</span> / <span>Loss: {lossPoints}</span>
      </div>
    )

    factionNicknameElement.append(eloElement)
  })

  if (match.state === 'finished') {
    const scoreElements = select.all(
      'section.match__info-box span[ng-bind^="match.score"]'
    )

    scoreElements.forEach(async scoreElement => {
      if (hasFeatureAttribute(scoreElement, FEATURE_ATTRIBUTE)) {
        return
      }
      setFeatureAttribute(scoreElement, FEATURE_ATTRIBUTE)

      const isFaction1 = scoreElement.getAttribute('ng-bind').includes('score1')
      const faction = isFaction1 ? FACTION_1 : FACTION_2
      const { winPoints, lossPoints } = calculateRatingChange(
        match[`${faction}Score`]
      )

      let points

      if (isFaction1) {
        points = match.winner === FACTION_1 ? winPoints : lossPoints
      } else {
        points = match.winner === FACTION_2 ? winPoints : lossPoints
      }

      const pointsElement = (
        <div className="text-lg">{points > 0 ? `+${points}` : points}</div>
      )

      setStyle(scoreElement, 'margin-top: -41px')
      scoreElement.append(pointsElement)
    })
  }
}
