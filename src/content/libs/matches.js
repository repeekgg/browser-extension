/* eslint-disable import/prefer-default-export */

export function mapMatchesByIdAndExtendElo(matches) {
  return matches.reduce((acc, { matchId, elo, ...match }, i) => {
    if (matches.length === i + 1) {
      return acc
    }

    const newElo = elo ? Number(elo) : null
    const nextMatchElo = matches[i + 1].elo
    const oldElo = nextMatchElo ? Number(nextMatchElo) : null
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
