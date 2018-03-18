/* eslint-disable import/prefer-default-export */

export function calculateRatingChange(winPercentage, K = 50) {
  const winPoints = Math.round(K * (1 - winPercentage))
  const lossPoints = Math.round(K * (0 - winPercentage))

  return {
    winPoints,
    lossPoints
  }
}
