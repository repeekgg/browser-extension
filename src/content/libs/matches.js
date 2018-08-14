/* eslint-disable import/prefer-default-export */
import { normalizeElo } from './elo'

export function mapMatchesByIdAndExtendElo(matches) {
  return matches.reduce((acc, { matchId, elo, ...match }, i) => {
    if (matches.length === i + 1) {
      return acc
    }

    const newElo = normalizeElo(elo)
    const oldElo = normalizeElo(matches[i + 1].elo)
    const eloDiff = oldElo && newElo ? newElo - oldElo : null

    return {
      ...acc,
      [matchId]: {
        ...match,
        newElo,
        oldElo,
        eloDiff
      }
    }
  }, {})
}
