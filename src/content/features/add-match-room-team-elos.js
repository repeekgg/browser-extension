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
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'team-elo'

export default async parent => {
  const { teamElements, isTeamV1Element } = getTeamElements(parent)

  const roomId = getRoomId()
  const match = isTeamV1Element ? getQuickMatch(roomId) : getMatch(roomId)

  let factions = await Promise.all(
    teamElements.map(async teamElement => {
      if (hasFeatureAttribute(teamElement, FEATURE_ATTRIBUTE)) {
        return
      }

      setFeatureAttribute(teamElement, FEATURE_ATTRIBUTE)

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

          const { game } = await match
          const elo = player.games[game].faceitElo || null

          return elo
        })
      )

      memberElos = memberElos.filter(m => Boolean(m))

      const { factionName } = getFactionDetails(teamElement, isTeamV1Element)

      const totalElo = memberElos.reduce((acc, curr) => acc + curr, 0)
      const averageElo = Math.round(totalElo / memberElos.length)

      return {
        name: factionName,
        totalElo,
        averageElo
      }
    })
  )

  factions = factions.filter(faction => Boolean(faction))

  if (factions.length === 0) {
    return
  }

  factions.forEach(async (faction, i) => {
    const eloDiff = faction.averageElo - factions[i === 0 ? 1 : 0].averageElo

    const eloElement = (
      <div className="text-muted" style={{ 'margin-top': 6, 'font-size': 14 }}>
        Avg. Elo: {faction.averageElo}
        <br />
        Diff: {eloDiff > 0 && '+'}
        {eloDiff}
      </div>
    )

    const factionNicknameElement = select(
      `h2[ng-bind="${
        isTeamV1Element
          ? `match.${faction.name}_nickname`
          : `vm.currentMatch.match.teams.${faction.name}.name`
      }"]`,
      parent
    )
    factionNicknameElement.append(eloElement)
  })
}
