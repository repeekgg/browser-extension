import select from 'select-dom'
import { getCurrentPath } from './location'

export const getTeamId = (path) => {
  const match =
    /teams\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
      path || getCurrentPath(),
    )

  return match && match[1]
}

export const getTeamMemberPlayerElements = (parent) =>
  select.all('ul.users-list > li', parent)

export const getTeamMemberNicknameElement = (parent) =>
  select('strong[ng-bind="member.nickname"]', parent)
