import select from 'select-dom'
import { getCurrentPath } from './location'
import { isBeta } from './is-beta'
import * as pages from './pages'

export const isInviteToParty = (parent) =>
  select.exists('h3[translate-once="INVITE-TO-PARTY"]', parent)

export const isMatchQueuing = (parent) =>
  select.exists('h3[translate-once="QUICK-MATCH-QUEUING"]', parent)

export const isMatchReady = (parent) =>
  select.exists('h3[translate-once="MATCH-READY"]', parent)

export const isMatchRoomCaptain = (parent) =>
  pages.isRoomOverview() &&
  select.exists(
    `h3[translate="<span class='text-primary'>Action</span> required"]`,
    parent,
  )

export const isMatchDefeat = (parent) =>
  select.exists('h2[translate-once="DEFEAT"]', parent)

export const isMatchVictory = (parent) =>
  select.exists('h2[translate-once="VICTORY"]', parent)

export const isGlobalRankingUpdate = (parent) =>
  select.exists('h2[translate-once="GLOBAL-RANKING-UPDATE"]', parent)

export const isInactive = (parent) =>
  select.exists('h3[translate-once="INACTIVE"]', parent)

export const isPlayerProfileStats = () =>
  isBeta
    ? /players\/.+\/stats\//.test(getCurrentPath())
    : /players-modal\/.+\/stats\//.test(getCurrentPath())

export const isPlayerProfile = () =>
  isBeta
    ? /players\/.*$/.test(getCurrentPath())
    : /players-modal\/.*$/.test(getCurrentPath())
