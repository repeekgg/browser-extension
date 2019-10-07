/* eslint-disable import/prefer-default-export */
import mem from 'mem'
import round from 'lodash/round'

export function normalizeElo(elo) {
  return elo ? Number(elo.replace(',', '')) : null
}

export function calculateRatingChange(elo1, elo2, K = 50) {
  const eloDiff = elo2 - elo1
  const percentage = 1 / (1 + Math.pow(10, eloDiff / 400))

  const winPoints = round(K * (1 - percentage))
  const lossPoints = round(K * (0 - percentage))

  return {
    winPoints: winPoints < 10 ? 10 : winPoints,
    lossPoints
  }
}

export const calculateRatingChangeMemoized = mem(calculateRatingChange)

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
