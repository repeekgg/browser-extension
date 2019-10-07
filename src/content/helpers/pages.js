/* eslint-disable import/prefer-default-export */
import { getCurrentPath } from './location'

export const isRoomOverview = path =>
  /room\/.+-.+-.+-.+$/.test(path || getCurrentPath())

export const isPlayerProfileStats = path =>
  /players\/.+\/stats\//.test(path || getCurrentPath())
