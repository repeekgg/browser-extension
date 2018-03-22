/* eslint-disable import/prefer-default-export */

export function mapMatchesByIdAndExtendElo(matches) {
  return matches.reduce((acc, { matchId, elo, ...match }, i) => {
    if (!elo || matches.length === i + 1) {
      return acc
    }

    const newElo = Number(elo) || null
    const oldElo = Number(matches[i + 1].elo) || null
    const eloDiff = oldElo ? newElo - oldElo : null

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
