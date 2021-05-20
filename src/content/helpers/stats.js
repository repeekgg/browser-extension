import mem from 'mem'
import {
  getTeamMemberElements,
  getNicknameElement,
  mapMatchNicknamesToPlayersMemoized
} from './match-room'
import { getPlayerStats } from './faceit-api'

const TOTAL_STATS_MAP = {
  m1: 'matches'
}

export const mapTotalStats = stats =>
  Object.keys(TOTAL_STATS_MAP).reduce(
    (acc, curr) => ({
      ...acc,
      [TOTAL_STATS_MAP[curr]]: stats[curr]
    }),
    {}
  )

export const mapTotalStatsMemoized = mem(mapTotalStats)

const AVERAGE_STATS_MAP = {
  c2: 'averageKDRatio',
  c3: 'averageKRRatio',
  c4: 'averageHeadshots',
  i6: 'averageKills'
}

export const mapAverageStats = stats =>
  stats
    .map(stat =>
      Object.keys(AVERAGE_STATS_MAP).reduce(
        (acc, curr) => ({
          ...acc,
          [AVERAGE_STATS_MAP[curr]]: stat[curr]
        }),
        {
          winRate: stat.i2 === stat.teamId ? 'win' : 'loss'
        }
      )
    )
    .reduce(
      (acc, curr, i) =>
        Object.keys(curr).reduce((acc2, curr2) => {
          let value

          if (stats.length === i + 1) {
            if (curr2 === 'winRate') {
              const results = [...acc[curr2], curr[curr2]]
              const wins = results.filter(x => x === 'win').length
              value = Math.round((wins / results.length) * 100)
            } else {
              value =
                (
                  acc[curr2].reduce(
                    (acc3, curr3) => acc3 + Number(curr3),
                    Number(curr[curr2])
                  ) / stats.length
                ).toFixed(2) / 1

              if (
                curr2 === AVERAGE_STATS_MAP.c4 ||
                curr2 === AVERAGE_STATS_MAP.i6
              ) {
                value = Math.round(value)
              }
            }
          } else {
            value = (acc[curr2] || []).concat(curr[curr2])
          }

          return {
            ...acc2,
            [curr2]: value
          }
        }, {}),
      {}
    )

export const mapAverageStatsMemoized = mem(mapAverageStats)

const MAP_PERCENT_STATS = {
  i1: 'map'
}

export const mapPercentStats = stats => {
  const mapsWinrate = stats
    .map(stat =>
      Object.keys(MAP_PERCENT_STATS).reduce((acc, curr) => {
        return {
          ...acc,
          ...{
            map: stat[curr],
            winRate: stat.i2 === stat.teamId ? 100 : 0
          }
        }
      }, {})
    )
    .reduce((acc, curr) => {
      if (curr.map in acc) {
        acc[curr.map].winRate += curr.winRate
        acc[curr.map].mapsCount += 1
      } else {
        acc[curr.map] = {
          winRate: curr.winRate,
          mapsCount: 1
        }
      }

      return acc
    }, {})

  for (const key in mapsWinrate) {
    if (Object.hasOwnProperty.call(mapsWinrate, key)) {
      mapsWinrate[key].winRate = Math.trunc(
        mapsWinrate[key].winRate / mapsWinrate[key].mapsCount
      )
    }
  }
  return mapsWinrate
}

export const mapPercentStatsMemoized = mem(mapPercentStats)

const getTeamStats = async (
  match,
  teamElements,
  isTeamV1Element,
  mapsNameOnMatch
) => {
  const { teams, game } = match
  const teamsData = [
    {
      name: teams.faction1.name,
      players: teams.faction1.roster.map(player => player.id),
      mapsStats: {}
    },
    {
      name: teams.faction2.name,
      players: teams.faction2.roster.map(player => player.id),
      mapsStats: {}
    }
  ]

  const nicknamesToPlayers = mapMatchNicknamesToPlayersMemoized(match)
  const userIds = []
  const statsPromises = []
  for (const teamElement of teamElements) {
    const memberElements = getTeamMemberElements(teamElement)

    for (const memberElement of memberElements) {
      const nicknameElement = getNicknameElement(memberElement, isTeamV1Element)
      const nickname = nicknameElement.textContent
      const player = nicknamesToPlayers[nickname]

      let userId
      if (isTeamV1Element) {
        userId = player.guid
      } else {
        userId = player.id
      }
      userIds.push(userId)
      statsPromises.push(getPlayerStats(userId, game))
    }
  }

  const stats = await Promise.all(statsPromises)
  userIds.forEach((userId, key) => {
    const { maps } = stats[key]

    if (!maps) {
      return
    }
    teamsData.forEach(team => {
      if (team.players.includes(userId)) {
        for (const mapName in maps) {
          if (Object.hasOwnProperty.call(maps, mapName)) {
            if (mapName in team.mapsStats) {
              team.mapsStats[mapName].winRate += maps[mapName].winRate
              team.mapsStats[mapName].mapsCount += maps[mapName].mapsCount
            } else {
              team.mapsStats[mapName] = {
                winRate: maps[mapName].winRate,
                mapsCount: maps[mapName].mapsCount
              }
            }
          }
        }
      }
    })
  })

  teamsData.forEach(({ mapsStats }) => {
    for (const map in mapsStats) {
      if (Object.hasOwnProperty.call(mapsStats, map)) {
        mapsStats[map].winRate = Math.trunc(mapsStats[map].winRate / 5)
        mapsStats[map].mapsCount = Math.trunc(mapsStats[map].mapsCount / 5)
      }
    }
  })

  mapsNameOnMatch.forEach(map => {
    const statTeamA = teamsData[0].mapsStats[map.mapName]
      ? teamsData[0].mapsStats[map.mapName].winRate
      : 0
    const statTeamB = teamsData[1].mapsStats[map.mapName]
      ? teamsData[1].mapsStats[map.mapName].winRate
      : 0
    map.stats = [
      {
        percent: statTeamA,
        mapsCount: teamsData[0].mapsStats[map.mapName].mapsCount
      },
      {
        percent: statTeamB,
        mapsCount: teamsData[1].mapsStats[map.mapName].mapsCount
      }
    ]
  })
  return mapsNameOnMatch
}

export const getTeamStatsMemoized = mem(getTeamStats)
