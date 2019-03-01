import select from 'select-dom'
import { getCurrentPath } from './location'

export const getTournamentId = path => {
  const match = /tournament\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
    path || getCurrentPath()
  )
  return match && match[1]
}

export const getRosterMembers = parentElement => {
  return select.all('.roster .roster__member', parentElement)
}
