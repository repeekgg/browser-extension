const BASE_URL = 'https://api.faceit.com'

const cache = new Map()

async function fetchApi(path) {
  if (typeof path !== 'string') {
    throw new TypeError(`Expected \`path\` to be a string, got ${typeof path}`)
  }

  try {
    const token = localStorage.getItem('token')
    const options = { headers: {} }

    if (token) {
      options.headers.Authorization = `Bearer ${token}`
    }

    let response

    if (cache.has(path)) {
      response = cache.get(path)
    } else {
      response = fetch(`${BASE_URL}${path}`, options)
      cache.set(path, response)
    }

    response = await response

    const json = await response.clone().json()
    const {
      result, // Status for old API(?)
      code, // Status for new API(?)
      payload
    } = json

    if ((result && result !== 'ok') || (code && code !== 'OPERATION-OK')) {
      throw json
    } else if (payload) {
      return payload
    }

    return json
  } catch (err) {
    console.error(err)

    return null
  }
}

export const getPlayer = nickname => fetchApi(`/core/v1/nicknames/${nickname}`)

const TOTAL_STATS_MAP = {
  m1: 'matches',
  k6: 'win_rate'
}

const AVERAGE_STATS_MAP = {
  c2: 'average_kd_ratio',
  c3: 'average_kr_ratio',
  c4: 'average_headshots',
  i6: 'average_kills'
}

export const getPlayerStats = async (userId, game, avgPastGames = 25) => {
  if (game !== 'csgo') {
    return null
  }

  let totalStats = await fetchApi(
    `/stats/api/v1/stats/users/${userId}/games/${game}`
  )

  if (!totalStats || Object.keys(totalStats).length === 0) {
    return null
  }

  totalStats = Object.keys(TOTAL_STATS_MAP).reduce(
    (acc, curr) => ({
      ...acc,
      [TOTAL_STATS_MAP[curr]]: totalStats.lifetime[curr]
    }),
    {}
  )

  let averageStats = await fetchApi(
    `/stats/api/v1/stats/time/users/${userId}/games/${game}?size=${avgPastGames}`
  )

  if (
    !averageStats ||
    !Array.isArray(averageStats) ||
    averageStats.length === 0
  ) {
    return null
  }

  averageStats = averageStats
    .map(stat =>
      Object.keys(AVERAGE_STATS_MAP).reduce(
        (acc, curr) => ({
          ...acc,
          [AVERAGE_STATS_MAP[curr]]: stat[curr]
        }),
        {}
      )
    )
    .reduce(
      (acc, curr, i) =>
        Object.keys(curr).reduce(
          (acc2, curr2) => ({
            ...acc2,
            [curr2]:
              averageStats.length === i + 1
                ? (
                    acc[curr2].reduce(
                      (acc3, curr3) => acc3 + curr3,
                      Number(curr[curr2])
                    ) / averageStats.length
                  ).toFixed(2)
                : (acc[curr2] || []).concat(Number(curr[curr2]))
          }),
          {}
        ),
      {}
    )

  return {
    ...totalStats,
    ...averageStats
  }
}

export const getQuickMatch = matchId => fetchApi(`/core/v1/matches/${matchId}`)

export const getMatch = matchId => fetchApi(`/match/v1/match/${matchId}`)
