/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getTeamElements,
  getRoomId,
  getTeamMemberElements,
  getNicknameElement,
  getFactionDetails
} from '../libs/match-room'
import { getQuickMatch, getMatch, getPlayer } from '../libs/faceit'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'
import { calculateRatingChangeMemoized } from '../libs/elo'

const FEATURE_ATTRIBUTE = 'team-elo'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element
    ? await getQuickMatch(roomId)
    : await getMatch(roomId)

  let factions = await Promise.all(
    teamElements.map(async teamElement => {
      const { factionName } = getFactionDetails(teamElement, isTeamV1Element)
      const factionElo = match[`${factionName}Elo`]

      let averageElo

      if (factionElo) {
        averageElo = factionElo
      } else {
        const memberElements = getTeamMemberElements(teamElement)

        let memberElos = await Promise.all(
          memberElements.map(async memberElement => {
            const nicknameElement = getNicknameElement(
              memberElement,
              isTeamV1Element
            )
            const nickname = nicknameElement.textContent

            const player = await getPlayer(nickname)

            if (!player) {
              return
            }

            const { game } = match
            const elo = player.games[game].faceitElo || null

            return elo
          })
        )

        memberElos = memberElos.filter(m => Boolean(m))

        const totalElo = memberElos.reduce((acc, curr) => acc + curr, 0)
        averageElo = Math.floor(totalElo / memberElos.length)
      }

      return {
        factionName,
        averageElo
      }
    })
  )

  factions = factions.filter(faction => Boolean(faction))

  if (factions.length !== 2) {
    return
  }

  factions.forEach(async (faction, i) => {
    const { factionName, averageElo } = faction

    const opponentAverageElo = factions[1 - i].averageElo
    const { winPoints, lossPoints } = calculateRatingChangeMemoized(
      averageElo,
      opponentAverageElo
    )

    const factionNicknameElement = select(
      `h2[ng-bind="${
        isTeamV1Element
          ? `match.${factionName}_nickname`
          : `vm.currentMatch.match.teams.${factionName}.name`
      }"]`,
      parent
    )

    if (!hasFeatureAttribute(factionNicknameElement, FEATURE_ATTRIBUTE)) {
      setFeatureAttribute(factionNicknameElement, FEATURE_ATTRIBUTE)

      const eloDiff = averageElo - opponentAverageElo

      const eloElement = (
        <div className="text-muted text-md" style={{ 'margin-top': 6 }}>
          Avg. Elo: {averageElo} / Diff: {eloDiff > 0 ? `+${eloDiff}` : eloDiff}
          <br />
          <span>Win: +{winPoints}</span> / <span>Loss: {lossPoints}</span>
        </div>
      )

      factionNicknameElement.append(eloElement)
    }

    const factionIndex = i + 1
    const scoreElement = select(
      isTeamV1Element
        ? `span[ng-bind="match.score${factionIndex}"]`
        : `span[ng-bind="vm.currentMatch.match.results.score.faction${factionIndex}"]`
    )

    if (scoreElement && !hasFeatureAttribute(scoreElement, FEATURE_ATTRIBUTE)) {
      setFeatureAttribute(scoreElement, FEATURE_ATTRIBUTE)

      const points =
        parseFloat(scoreElement.textContent) === 1 ? winPoints : lossPoints

      const pointsElement = (
        <div className="text-lg">{points > 0 ? `+${points}` : points}</div>
      )

      setStyle(scoreElement, 'margin-top: -41px')
      scoreElement.append(pointsElement)
    }
  })
}
