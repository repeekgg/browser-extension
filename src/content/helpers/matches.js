/* eslint-disable import/prefer-default-export */
import { normalizeElo } from './elo'

export function mapMatchesWithElo(matches, game) {
  const matchesByGame = matches.filter(match => match.game === game)

  if (matchesByGame.length === 0) {
    return null
  }

  return matchesByGame.reduce((acc, { matchId, elo, ...match }, i) => {
    if (matches.length === i + 1) {
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
