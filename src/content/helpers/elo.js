/* eslint-disable import/prefer-default-export */
import mem from 'mem'
import round from 'lodash/round'
import isNumber from 'lodash/isNumber'
import { getMatchmakingQueue } from './faceit-api'

export function normalizeElo(elo) {
  return Number(elo.replace(',', ''))
}

export function estimateRatingChange(elo1, elo2, K = 50) {
  const eloDiff = elo2 - elo1
  const percentage = 1 / (1 + Math.pow(10, eloDiff / 400))

  const gain = round(K * (1 - percentage))
  const loss = round(K * (0 - percentage))

  return {
    gain: gain || 1,
    loss: loss || -1
  }
}

export const estimateRatingChangeMemoized = mem(estimateRatingChange)

export const LEVELS = {
  1: [1, 800],
  2: [801, 950],
  3: [951, 1100],
  4: [1101, 1250],
  5: [1251, 1400],
  6: [1401, 1550],
  7: [1551, 1700],
  8: [1701, 1850],
  9: [1851, 2000],
  10: [2001, null]
}

export async function getEloChangesByMatches(matches) {
  const eloMatches = (
    await Promise.all(
      matches.map(async match => {
        const { competitionId } = match

        if (competitionId) {
          const [matchmakingQueue] =
            (await getMatchmakingQueue(competitionId)) || []

          if (!matchmakingQueue || !matchmakingQueue.calculateElo) {
            return
          }

          return match
        }
      })
    )
  ).filter(Boolean)

  const eloHistoryByMatches = eloMatches.reverse().reduce((acc, match, i) => {
    if (i === 0) {
      return acc
    }

    const isWin = match.i2 === match.teamId

    const previousMatch = eloMatches[i - 1]

    const previousElo = previousMatch.elo && normalizeElo(previousMatch.elo)
    const newElo = match.elo && normalizeElo(match.elo)
    const eloDiff =
      isNumber(previousElo) && isNumber(newElo) ? newElo - previousElo : null

    if (
      !eloDiff ||
      (isWin && eloDiff < 0) ||
      (!isWin && eloDiff > 0) ||
      eloDiff > 50 ||
      eloDiff < -50
    ) {
      return acc
    }

    return {
      ...acc,
      [match.matchId]: {
        previousElo,
        newElo,
        eloDiff
      }
    }
  }, {})

  return Object.keys(eloHistoryByMatches).length > 0
    ? eloHistoryByMatches
    : null
}
