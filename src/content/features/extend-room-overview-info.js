/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import browser from 'webextension-polyfill'
import { getRoomId } from '../libs/pages'
import {
  getMatch,
  getQuickMatch,
  getPlayer,
  getPlayerStats
} from '../libs/faceit'
import createFlagElement from '../components/flag'
import createPlayerEloElement from '../components/player-elo'
import createTeamEloElement from '../components/team-elo'

function mapPartiesToColors(party, alignedLeft) {
  const distinctColors = [
    '#BE0032',
    '#F3C300',
    '#875692',
    '#A1CAF1',
    '#F2F3F4',
    '#848482',
    '#008856',
    '#F38400',
    '#E68FAC',
    '#0067A5'
  ]

  const colors = party.reduce(
    (acc, curr) => {
      const color = alignedLeft ? distinctColors.shift() : distinctColors.pop()

      return curr.active_team_id && !acc.party[curr.active_team_id]
        ? {
            ...acc,
            party: {
              ...acc.party,
              [curr.active_team_id]: color
            }
          }
        : {
            ...acc,
            solo: {
              ...acc.solo,
              [curr.guid]: color
            }
          }
    },
    { party: {}, solo: {} }
  )

  return colors
}

async function extendRoomOverviewInfo(teams, isMatchRoomV1, parent) {
  if (teams.length === 2) {
    teams.forEach(async team => {
      const roomId = getRoomId()
      let match = isMatchRoomV1 ? getQuickMatch(roomId) : getMatch(roomId)

      const faction = team
        .getAttribute('members')
        .split(isMatchRoomV1 ? 'match.' : 'derived.')[1]
      const alignedLeft = faction === 'faction1'

      let teamElo = []

      const members = select.all('.match-team-member', team)

      match = await match
      const { game } = match

      let party
      let partyColors
      if (isMatchRoomV1) {
        party = match[faction]
        partyColors = mapPartiesToColors(party, alignedLeft)
      }

      await Promise.all(
        members.map(async member => {
          if (!member.hasAttribute('faceit-enhancer')) {
            member.setAttribute('faceit-enhancer', true)

            const details = select('.match-team-member__details', member)

            const gameNickname = select(
              isMatchRoomV1
                ? 'span[ng-bind="::teamMember[gameContext + \'_name\']"]'
                : 'span[ng-bind="::vm.teamMember.gameName"]',
              details
            )

            if (gameNickname) {
              gameNickname.remove()

              const controls = select('div.match-team-member__controls', member)

              if (controls) {
                controls.setAttribute('style', 'font-size: 12px; padding: 4px;')

                const gameProfile = select(
                  `a[ng-if*="match.gameData.matchroom.profile_url"]`,
                  member
                )

                if (gameProfile) {
                  gameProfile.setAttribute(
                    'style',
                    `width: auto; display: flex; align-items: center`
                  )
                  gameProfile[alignedLeft ? 'append' : 'prepend'](
                    gameNickname.innerHTML
                  )

                  const gameIcon = select('i', gameProfile)
                  gameIcon.setAttribute(
                    'style',
                    `margin-${alignedLeft ? 'right' : 'left'}: 4px;`
                  )
                }
              }
            }

            const nickname = select(
              `strong[${
                isMatchRoomV1
                  ? 'ng-bind="::teamMember.nickname"'
                  : 'ng-bind="vm.teamMember.nickname"'
              }]`,
              details
            )

            const player = await getPlayer(nickname.innerHTML)

            // When a player changes his nickname,
            // the match data won't be updated accordingly,
            // so he can't be found.
            if (player) {
              const { country, games, guid } = player

              // Flag
              const flag = createFlagElement({ country, alignedLeft })
              nickname[alignedLeft ? 'prepend' : 'append'](flag)

              // Elo
              let elo = games[game].faceit_elo || 0
              teamElo.push(elo)
              elo = createPlayerEloElement({ elo, alignedLeft })
              const name = select(
                'div.match-team-member__details__name',
                details
              )
              name.appendChild(elo)

              // Party Indicators
              if (party) {
                const partyId =
                  party.find(member => member.guid === guid).active_team_id ||
                  guid
                const partyColor =
                  partyColors.party[partyId] || partyColors.solo[partyId]

                member.setAttribute(
                  'style',
                  `border-${
                    alignedLeft ? 'left' : 'right'
                  }: 3px solid ${partyColor}; border-radius: 0;`
                )
              }

              // Stats
              const {
                matchRoomShowPlayerStats
              } = await browser.storage.sync.get('matchRoomShowPlayerStats')

              if (matchRoomShowPlayerStats) {
                const playerStats = await getPlayerStats(guid, game)

                if (!playerStats) return

                const {
                  matches,
                  win_rate, // eslint-disable-line camelcase
                  average_kd_ratio, // eslint-disable-line camelcase
                  average_kills, // eslint-disable-line camelcase
                  average_kr_ratio, // eslint-disable-line camelcase
                  average_headshots // eslint-disable-line camelcase
                } = playerStats

                const stat = (value, label) => (
                  <div style={{ flex: 1, padding: 9 }}>
                    {value}
                    <br />
                    <span className="text-muted">{label}</span>
                  </div>
                )

                const statsVerticalDivider = () => (
                  <div style={{ width: 1, background: '#333' }} />
                )

                const stats = (
                  <div
                    className="text-light"
                    style={{
                      display: 'flex',
                      background: '#1b1b1f',
                      'border-top': '1px solid #333',
                      'text-align': !alignedLeft && 'right',
                      'line-height': '1',
                      'font-size': 12
                    }}
                  >
                    {stat(
                      `${matches} / ${win_rate}%`, // eslint-disable-line camelcase
                      'Matches / Wins'
                    )}
                    {statsVerticalDivider()}
                    {stat(
                      `${Math.round(average_kills)} / ${average_headshots}%`, // eslint-disable-line camelcase
                      'Avg. Kills / HS'
                    )}
                    {statsVerticalDivider()}
                    {stat(
                      `${average_kd_ratio} / ${average_kr_ratio}`, // eslint-disable-line camelcase
                      'Avg. K/D / K/R'
                    )}
                  </div>
                )

                details.after(stats)
              }
            }
          }
        })
      )

      // Team Elo
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
const MEMBERS_ATTRIBUTE = '[members]:not([members=""])'

export default parent => {
  let teams
  let isMatchRoomV1 = false

  if (select.exists(`${MATCH_TEAM_V1}${MEMBERS_ATTRIBUTE}`, parent)) {
    isMatchRoomV1 = true
    teams = select.all(MATCH_TEAM_V1, parent)
  } else if (select.exists(`${MATCH_TEAM_V2}${MEMBERS_ATTRIBUTE}`, parent)) {
    teams = select.all(MATCH_TEAM_V2, parent)
  }

  if (teams) {
    extendRoomOverviewInfo(teams, isMatchRoomV1, parent)
  }
}
