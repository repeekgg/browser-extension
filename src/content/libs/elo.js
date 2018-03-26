/* eslint-disable import/prefer-default-export */
import mem from 'mem'

export function calculateRatingChange(elo1, elo2, K = 50) {
  const eloDiff = elo2 - elo1
  const percentage = 1 / (1 + Math.pow(10, eloDiff / 400))

  const winPoints = Math.round(K * (1 - percentage))
  const lossPoints = Math.round(K * (0 - percentage))

  return {
    winPoints: winPoints < 10 ? 10 : winPoints,
    lossPoints
  }
}

export const calculateRatingChangeMemoized = mem(calculateRatingChange)
