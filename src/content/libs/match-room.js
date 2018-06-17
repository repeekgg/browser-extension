import select from 'select-dom'
import mem from 'mem'
import isEmpty from 'lodash/isEmpty'
import head from 'lodash/head'
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

export const getFactionIsPremade = factionType => factionType === 'premade'

const COLOR_PALETTE = ['#0082c8', '#ffe119', '#808080', '#3cb44b', '#e6194b']

export function mapPlayersToPartyColors(
  faction,
  isFaction1,
  isPremade,
  colorPalette = COLOR_PALETTE
) {
  const availableColors = [...colorPalette]
  const pickColor = () =>
    isFaction1 ? availableColors.shift() : availableColors.pop()

  return faction
    .reduce((acc, curr) => {
      let partyColor

      if (isPremade) {
        partyColor = isEmpty(acc) ? pickColor() : head(acc).partyColor
      } else if (curr.activeTeamId) {
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

export const mapPlayersToPartyColorsMemoized = mem(mapPlayersToPartyColors, {
  cacheKey: faction => JSON.stringify(faction)
})

const mapMatchNicknamesToPlayers = match => {
  const nicknamesToPlayers = {}
  let allPlayers
  if (match.faction1 && match.faction2) {
    allPlayers = match.faction1.concat(match.faction2)
  } else if (match.teams && match.teams.faction1 && match.teams.faction2) {
    allPlayers = match.teams.faction1.roster.concat(match.teams.faction2.roster)
  } else {
    throw new Error(
      `Not sure how to handle this match: ${match.guid || match.id}`
    )
  }

  allPlayers.forEach(player => {
    const { nickname } = player
    nicknamesToPlayers[nickname] = player
  })

  return nicknamesToPlayers
}

export const mapMatchNicknamesToPlayersMemoized = mem(
  mapMatchNicknamesToPlayers,
  {
    cacheKey: match => JSON.stringify(match.guid || match.id)
  }
)
