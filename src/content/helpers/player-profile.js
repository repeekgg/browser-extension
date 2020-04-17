/* eslint-disable import/prefer-default-export */
import { getCurrentPath } from './location'

export const getPlayerProfileNickname = path => {
  const match = /players(?:-modal)?\/([^/]+)\//.exec(path || getCurrentPath())

  if (!match || !match[1]) {
    const profile = /players(?:-modal)?\/([^/]+)$/.exec(
      path || getCurrentPath()
    )
    return profile && profile[1]
  }

  return match && match[1]
}

export const getPlayerProfileStatsGame = path => {
  const match = /\/stats\/([a-z0-9]+)/.exec(path || getCurrentPath())

  return match && match[1]
}
