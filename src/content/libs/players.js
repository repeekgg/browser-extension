/* eslint-disable import/prefer-default-export */
import { getCurrentPath } from './location'

export const getPlayerId = path => {
  const player = /players\/(.+)\/stats\/(.+)/.exec(path || getCurrentPath())

  return player && player[1]
}
