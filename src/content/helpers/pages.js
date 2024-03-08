import { getCurrentPath } from './location'

export const isRoomOverview = (path) =>
  /room\/.+-.+-.+-.+$/.test(path || getCurrentPath())

export const isPlayerProfileStats = (path) =>
  /players\/.+\/stats\//.test(path || getCurrentPath())

export const isPlayerProfile = (path) =>
  /players\/.*$/.test(path || getCurrentPath())

export const isPlayerProfileOverview = (path) =>
  /players\/[^\s\/]+$/.test(path || getCurrentPath())

export const isTeamsOverview = (path) =>
  /teams\/.+-.+-.+-.+$/.test(path || getCurrentPath())
