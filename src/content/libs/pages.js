import { getCurrentPath } from './utils'

export const getRoomId = path => {
  const match = /room\/(.+-.+-.+-.+)/.exec(path || getCurrentPath())

  return match && match[1]
}

export const isRoomOverview = path =>
  /room\/.+-.+-.+-.+$/.test(path || getCurrentPath())
