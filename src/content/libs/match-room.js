import select from 'select-dom'
import { getCurrentPath } from './location'

export const FACTION_1 = 'faction1'
export const FACTION_2 = 'faction2'

export const getRoomId = path => {
  const match = /room\/(.+-.+-.+-.+)/.exec(path || getCurrentPath())

  return match && match[1]
}

export const MATCH_TEAM_V1 = 'match-team'
export const MATCH_TEAM_V2 = 'match-team-v2'
export const MEMBERS_ATTRIBUTE = '[members]:not([members=""])'

export const matchRoomIsReady = () =>
  select.exists(`${MATCH_TEAM_V1}${MEMBERS_ATTRIBUTE}`) ||
  select.exists(`${MATCH_TEAM_V2}${MEMBERS_ATTRIBUTE}`)

export const getTeamElements = parent => {
  let teamElements = select.all(MATCH_TEAM_V1, parent)
  let isTeamV1Element = true

  if (teamElements.length === 0) {
    teamElements = select.all(MATCH_TEAM_V2, parent)
    if (teamElements.length > 0) {
      isTeamV1Element = false
    }
  }

  return {
    teamElements,
    isTeamV1Element
  }
}

export const getFactionDetails = (element, isTeamV1Element = true) => {
  if (!element.hasAttribute('members')) {
    return null
  }

  const factionName = element
    .getAttribute('members')
    .split(isTeamV1Element ? 'match.' : 'derived.')[1]

  const isFaction1 = factionName === 'faction1'

  return {
    factionName,
    isFaction1
  }
}

export const getIsFaction1 = factionName => factionName.includes('faction1')

export const getTeamMemberElements = parent =>
  select.all('.match-team-member', parent)

export const getNicknameElement = (parent, isTeamV1Element) =>
  select(
    `strong[${
      isTeamV1Element
        ? 'ng-bind="::teamMember.nickname"'
        : 'ng-bind="vm.teamMember.nickname"'
    }]`,
    parent
  )

const COLOR_PALETTE = ['#0082c8', '#ffe119', '#808080', '#3cb44b', '#e6194b']

export function mapPlayersToPartyColors(
  faction,
  isFaction1,
  colorPalette = COLOR_PALETTE
) {
  const availableColors = [...colorPalette]
  const pickColor = () =>
    isFaction1 ? availableColors.shift() : availableColors.pop()

  return faction
    .reduce((acc, curr) => {
      let partyColor

      if (curr.activeTeamId) {
        const partyMember = acc.find(
          ({ activeTeamId }) => activeTeamId === curr.activeTeamId
        )

        if (partyMember) {
          partyColor = partyMember.partyColor
        } else {
          partyColor = pickColor()
        }
      } else {
        partyColor = pickColor()
      }

      return acc.concat({
        ...curr,
        partyColor
      })
    }, [])
    .reduce(
      (acc, curr) => ({
        ...acc,
        [curr.nickname]: curr.partyColor
      }),
      {}
    )
}
