import select from 'select-dom'

export const isInviteToParty = parent =>
  select.exists('h3[translate-once="INVITE-TO-PARTY"]', parent)

export const isMatchQueuing = parent =>
  select.exists('h3[translate-once="QUICK-MATCH-QUEUING"]', parent)

export const isMatchReady = parent =>
  select.exists('h3[translate-once="MATCH-READY"]', parent)
