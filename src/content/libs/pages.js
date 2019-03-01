/* eslint-disable import/prefer-default-export */
import select from 'select-dom'
import { getCurrentPath } from './location'

export const isRoomOverview = path =>
  /room\/.+-.+-.+-.+$/.test(path || getCurrentPath())

export const isPlayerProfileStats = path =>
  /players\/.+\/stats\//.test(path || getCurrentPath())

export const isTournamentOverview = () => path =>
  /tournament\/.+-.+-.+-.+$/.test(path || getCurrentPath())

export const hasTournamentCheckin = () =>
  select('.modal-dialog__header__title[translate-once="TEAM-FOUND"]') !== null
