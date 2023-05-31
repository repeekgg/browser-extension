import select from 'select-dom'
import mem from 'mem'
import isEmpty from 'lodash/isEmpty'
import head from 'lodash/head'
import { getCurrentPath } from './location'

export const FACTION_1 = 'faction1'
export const FACTION_2 = 'faction2'

export const getRoomId = path => {
  const match = /room\/([0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+-[0-9a-z]+(?:-[0-9a-z]+)?)/.exec(
    path || getCurrentPath()
  )

  return match && match[1]
}

export const MATCH_TEAM_V1 = 'match-team'
export const MATCH_TEAM_V2 = 'match-team-v2'
export const MEMBERS_ATTRIBUTE = '[members]:not([members=""])'

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

export const getNicknameElement = parent =>
  select(`strong[ng-bind="vm.teamMember.nickname"]`, parent)

export const getFactionIsPremadeV1 = factionType => factionType === 'premade'

const COLOR_PALETTE = ['#0082c8', '#ffe119', '#808080', '#3cb44b', '#e6194b']

export function mapPlayersToPartyColors(
  match,
  isTeamV1Element,
  factionDetails,
  colorPalette = COLOR_PALETTE
) {
  const { factionName, isFaction1 } = factionDetails
  const faction = isTeamV1Element
    ? match[factionName]
    : match.teams[factionName].roster
  const factionType = match[`${factionName}Type`]
  const isPremade = isTeamV1Element && getFactionIsPremadeV1(factionType)

  const parties = match.entityCustom && match.entityCustom.parties
  const partiesIds = parties && Object.keys(parties)

  const availableColors = [...colorPalette]
  const pickColor = () =>
    isFaction1 ? availableColors.shift() : availableColors.pop()

  return faction
    .reduce((acc, curr) => {
      let partyColor

      if (isPremade) {
        partyColor = isEmpty(acc) ? pickColor() : head(acc).partyColor
      } else if (curr.activeTeamId || !isTeamV1Element) {
        let partyMember
        if (isTeamV1Element) {
          partyMember = acc.find(
            ({ activeTeamId }) => activeTeamId === curr.activeTeamId
          )
        } else {
          const playerPartyId = partiesIds.find(partyId => {
            const party = parties[partyId]
            return party.indexOf(curr.id) !== -1
          })
          const playerParty = parties[playerPartyId]
          partyMember = acc.find(({ id }) => playerParty.indexOf(id) !== -1)
        }

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
  cacheKey: (match, isTeamV1Element, factionDetails) => {
    const { factionName } = factionDetails
    const faction = isTeamV1Element
      ? match[factionName]
      : match.teams[factionName].roster

    return JSON.stringify(faction)
  }
})

const mapMatchFactionRosters = match => {
  if (match.faction1 && match.faction2) {
    return {
      faction1: match.faction1,
      faction2: match.faction2
    }
  }
  if (match.teams && match.teams.faction1 && match.teams.faction2) {
    return {
      faction1: match.teams.faction1.roster,
      faction2: match.teams.faction2.roster
    }
  }
  throw new Error(
    `Not sure how to handle this match: ${match.guid || match.id}`
  )
}

export const mapMatchFactionRostersMemoized = mem(mapMatchFactionRosters, {
  cacheKey: match => JSON.stringify(match.guid || match.id)
})

export const mapMatchFactionWinRates = (rosters, matches, mapName) => {
  return Object.keys(rosters).map(factionName => {
    const players = rosters[factionName].map(i => i.nickname)
    const games = matches.filter(
      match => players.includes(match.nickname) && match.i1 === mapName
    )
    const won = games.filter(match => match.i10 === '1')

    const winRate = Math.floor((won.length / games.length || 0) * 100)
    const gamesPlayed = games.length

    return {
      winRate,
      gamesPlayed
    }
  })
}

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

export const getMatchState = element => {
  const matchStateElement = select('matchroom-versus-status h5', element)

  if (!matchStateElement) {
    return null
  }

  return matchStateElement.textContent
}
