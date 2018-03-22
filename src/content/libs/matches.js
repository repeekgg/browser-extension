/* eslint-disable import/prefer-default-export */

export function mapMatchesByIdAndExtendElo(matches) {
  return matches.reduce((acc, { matchId, elo, ...match }, i) => {
    if (matches.length === i + 1) {
      return acc
    }

    const newElo = Number(elo)
    const oldElo = Number(matches[i + 1].elo)

    return {
      ...acc,
      [matchId]: {
        ...match,
        newElo,
        oldElo,
        eloDiff: newElo - oldElo
      }
    }
  }, {})
}
