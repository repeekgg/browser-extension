/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import {
  getPlayer,
  getPlayerMatches,
  getQuickMatch,
  getMatch,
  getSelf
} from '../helpers/faceit-api'
import { mapMatchesWithElo } from '../helpers/matches'
import { getPlayerProfileNickname } from '../helpers/player-profile'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { calculateRatingChange } from '../helpers/elo'
import getMatchHistory from '../helpers/match-history'

const FEATURE_ATTRIBUTE = 'elo-points'

export default async parentElement => {
  const matchHistoryElement = select(
    'div.js-match-history-stats',
    parentElement
  )

  if (!matchHistoryElement) {
    return
  }

  const nickname = await getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const self = await getSelf()
  const game = self.flag
  const selfHasFreeMembership = self.membership.type === 'free'
  const matches = await getPlayerMatches(player.guid, player.flag, 21)

  const matchesById = mapMatchesWithElo(matches, game)

  const matchElements = select.all(
    'tbody > tr.match-history-stats__row',
    matchHistoryElement
  )

  if (matchElements.length === 0) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)

  const matchHistory = await getMatchHistory(player.guid, matchElements.length)

  matchElements.forEach(async (matchElement, index) => {
    const matchId = matchHistory[index].matchId

    if (!matchesById[matchId]) {
      return
    }

    let { eloDiff, newElo, teamId, gameMode } = matchesById[matchId]

    if (!eloDiff) {
      let match

      if (gameMode.includes('5v5')) {
        match = await getQuickMatch(matchId)
        if (!match) {
          match = await getMatch(matchId)
        }
      } else {
        match = await getMatch(matchId)
      }

      const { faction1Id, faction1Elo, faction2Elo, winner } = match

      if (faction1Id && faction1Elo) {
        const isFaction1 = faction1Id === teamId
        const { winPoints, lossPoints } = calculateRatingChange(
          isFaction1 ? faction1Elo : faction2Elo,
          isFaction1 ? faction2Elo : faction1Elo
        )

        const hasWon =
          (winner === 'faction1' && isFaction1) ||
          (winner === 'faction2' && !isFaction1)
        eloDiff = hasWon ? winPoints : lossPoints
      }
    }

    const resultElement = select('td:nth-child(3) span', matchElement)

    if (eloDiff) {
      const gainedElo = eloDiff > 0
      resultElement.textContent = `${resultElement.textContent} (${
        gainedElo ? '+' : ''
      }${eloDiff})`
    }

    if (selfHasFreeMembership || !newElo) {
      return
    }

    const newEloElement = (
      <div style={{ color: '#fff', 'font-weight': 'normal' }}>
        New Elo: {newElo}
      </div>
    )

    resultElement.append(newEloElement)
  })
}
