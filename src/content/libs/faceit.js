import camelcaseKeys from 'camelcase-keys'
import { mapTotalStats, mapAverageStats } from './stats'

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
    }

    return camelcaseKeys(payload || json, { deep: true })
  } catch (err) {
    console.error(err)

    return null
  }
}

export const getPlayer = nickname => fetchApi(`/core/v1/nicknames/${nickname}`)

export const getPlayerStats = async (userId, game, avgPastGames = 20) => {
  if (game !== 'csgo') {
    return null
  }

  let totalStats = await fetchApi(
    `/stats/api/v1/stats/users/${userId}/games/${game}`
  )

  if (!totalStats || Object.keys(totalStats).length === 0) {
    return null
  }

  totalStats = mapTotalStats(totalStats.lifetime)

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

  averageStats = mapAverageStats(averageStats)

  return {
    ...totalStats,
    ...averageStats
  }
}

export const getQuickMatch = matchId => fetchApi(`/core/v1/matches/${matchId}`)

export const getMatch = matchId => fetchApi(`/match/v1/match/${matchId}`)

export const prefetchPlayersFromMatch = match =>
  ['faction1', 'faction2'].forEach(key =>
    match[key].forEach(({ nickname }) => getPlayer(nickname))
  )
