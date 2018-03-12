import select from 'select-dom'
import { getRoomId } from '../libs/pages'
import { getMatch, getQuickMatch, getPlayer } from '../libs/faceit'
import createFlagElement from '../components/flag'
import createPlayerEloElement from '../components/player-elo'
import createTeamEloElement from '../components/team-elo'

function mapPartiesToColors(party, alignedLeft) {
  const distinctColors = [
    '#BE0032',
    '#F3C300',
    '#875692',
    '#A1CAF1',
    '#C2B280',
    '#848482',
    '#008856',
    '#F38400',
    '#E68FAC',
    '#0067A5'
  ]

  const colors = party.reduce(
    (acc, curr) => {
      const color = alignedLeft ? distinctColors.shift() : distinctColors.pop()

      return curr.active_team_id && !acc.parties[curr.active_team_id]
        ? {
            ...acc,
            parties: {
              ...acc.parties,
              [curr.active_team_id]: color
            }
          }
        : {
            ...acc,
            solos: {
              ...acc.solos,
              [curr.guid]: color
            }
          }
    },
    { parties: {}, solos: {} }
  )

  return colors
}

async function extendRoomOverviewInfo(teams, isMatchRoomV1, parent) {
  if (teams.length === 2) {
    teams.forEach(async team => {
      const roomId = getRoomId()
      const { game, ...match } = isMatchRoomV1
        ? await getQuickMatch(roomId)
        : await getMatch(roomId)

      const faction = team
        .getAttribute('members')
        .split(isMatchRoomV1 ? 'match.' : 'derived.')[1]
      const alignedLeft = faction === 'faction1'

      let teamElo = []

      let party
      let partyColors
      if (isMatchRoomV1) {
        party = match[faction]
        partyColors = mapPartiesToColors(party, alignedLeft)
      }

      const members = select.all('.match-team-member', team)

      await Promise.all(
        members.map(async member => {
          if (!member.hasAttribute('faceit-enhancer')) {
            member.setAttribute('faceit-enhancer', true)

            const name = select('.match-team-member__details__name', member)
            const nickname = select(
              `strong[${
                isMatchRoomV1
                  ? 'ng-bind="::teamMember.nickname"'
                  : 'ng-bind="vm.teamMember.nickname"'
              }]`,
              name
            )

            const player = await getPlayer(nickname.innerHTML)

            // When a player changes his nickname,
            // the match data won't be updated accordingly,
            // so he can't be found.
            if (player) {
              const { country, games, guid } = player

              const flag = createFlagElement({ country, alignedLeft })
              nickname[alignedLeft ? 'prepend' : 'append'](flag)

              let elo = games[game].faceit_elo
              teamElo.push(elo)
              elo = createPlayerEloElement({ elo: games[game].faceit_elo })
              name.appendChild(elo)

              if (party) {
                const partyId =
                  party.find(member => member.guid === guid).active_team_id ||
                  guid
                const partyColor =
                  partyColors.parties[partyId] || partyColors.solos[partyId]

                member.setAttribute(
                  'style',
                  `border-${
                    alignedLeft ? 'left' : 'right'
                  }: 3px solid ${partyColor}; border-radius: 0;`
                )
              }
            }
          }
        })
      )

      if (teamElo.length > 0) {
        const teamName = select(
          `h2[ng-bind="${
            isMatchRoomV1
              ? `match.${faction}_nickname`
              : `vm.currentMatch.match.teams.${faction}.name`
          }"]`,
          parent
        )

        if (!teamName.hasAttribute('faceit-enhancer')) {
          teamName.setAttribute('faceit-enhancer', true)

          const totalElo = teamElo.reduce((acc, curr) => acc + curr, 0)
          const averageElo = Math.round(totalElo / teamElo.length)
          teamElo = createTeamEloElement({ totalElo, averageElo })

          teamName.append(teamElo)
        }
      }
    })
  }
}

const MATCH_TEAM_V1 = 'match-team'
const MATCH_TEAM_V2 = 'match-team-v2'

export default parent => {
  let teams
  let isMatchRoomV1 = false

  if (select.exists(MATCH_TEAM_V1, parent)) {
    isMatchRoomV1 = true
    teams = select.all(MATCH_TEAM_V1, parent)
  } else if (select.exists(MATCH_TEAM_V2, parent)) {
    teams = select.all(MATCH_TEAM_V2, parent)
  }

  if (teams) {
    extendRoomOverviewInfo(teams, isMatchRoomV1, parent)
  }
}
