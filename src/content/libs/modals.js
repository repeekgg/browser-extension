import select from 'select-dom'
import * as pages from './pages'
import { getCurrentPath } from './location'

export const isInviteToParty = parent =>
  select.exists('h3[translate-once="INVITE-TO-PARTY"]', parent)

export const isMatchQueuing = parent =>
  select.exists('h3[translate-once="QUICK-MATCH-QUEUING"]', parent)

export const isMatchReady = parent =>
  select.exists('h3[translate-once="MATCH-READY"]', parent)

export const isMatchRoomCaptain = parent =>
  pages.isRoomOverview() &&
  select.exists(
    `h3[translate="<span class='text-primary'>Action</span> required"]`,
    parent
  )

export const isMatchDefeat = parent =>
  select.exists('h2[translate-once="DEFEAT"]', parent)

export const isMatchVictory = parent =>
  select.exists('h2[translate-once="VICTORY"]', parent)

export const isPlayerProfileStats = () =>
  /players-modal\/.+\/stats\//.test(getCurrentPath())
