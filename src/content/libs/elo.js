/* eslint-disable import/prefer-default-export */
import clamp from 'lodash.clamp'
import mem from 'mem'

export function calculateRatingChange(elo1, elo2, K = 50) {
  const eloDiff = elo2 - elo1
  const percentage = 1 / (1 + Math.pow(10, eloDiff / 400))

  const winPoints = clamp(Math.round(K * (1 - percentage)), 10, 50)
  const lossPoints = clamp(Math.round(K * (0 - percentage)), -50, -10)

  return {
    winPoints,
    lossPoints
  }
}

export const calculateRatingChangeMemoized = mem(calculateRatingChange)
