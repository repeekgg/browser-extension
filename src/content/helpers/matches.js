/* eslint-disable import/prefer-default-export */
import { normalizeElo } from './elo'
import { getMatchmakingQueue } from './faceit-api'

export async function mapMatchesWithElo(matches, game) {
  const eloEnabled = {}

  const matchPromises = matches.map(async match => {
    const competitionId = match.competitionId
    // Note: Old matches won't have competitionId
    if (competitionId) {
      const queue = await getMatchmakingQueue(competitionId)
      eloEnabled[competitionId] = queue.length > 0 && queue[0].calculateElo
    }
  })

  await Promise.all(matchPromises)

  const matchesByGame = matches.filter(match => {
    return match.game === game && eloEnabled[match.competitionId]
  })

  if (matchesByGame.length === 0) {
    return null
  }

  return matchesByGame.reduce((acc, { matchId, elo, ...match }, i) => {
    if (matchesByGame.length === i + 1) {
      return acc
    }

    const eloBefore = normalizeElo(matchesByGame[i + 1].elo)
    const eloAfter = normalizeElo(elo)
    const eloDiff = eloBefore && eloAfter ? eloAfter - eloBefore : null

    return {
      ...acc,
      [matchId]: {
        ...match,
        eloBefore,
        eloAfter,
        eloDiff
      }
    }
  }, {})
}
