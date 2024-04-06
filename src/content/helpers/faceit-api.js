import camelcaseKeys from 'camelcase-keys'
import format from 'date-fns/format'
import Cookies from 'js-cookie'
import pMemoize from 'p-memoize'
import browser from 'webextension-polyfill'
import { ACTION_FETCH_FACEIT_API } from '../../shared/constants'
import { isSupportedGame } from './games'
import { mapAverageStatsMemoized, mapTotalStatsMemoized } from './stats'

export const CACHE_TIME = 600000

export const getPlayerBans = async (userId) => {
  const limit = 20
  const offset = 0

  return fetchApiMemoized(
      `/queue/v1/ban?userId=${userId}&organizerId=faceit&offset=${offset}&limit=${limit}`
  )
}

async function fetchApi(path, fetchOptions = {}, camelcaseKeysOptions = {}) {
  if (typeof path !== 'string') {
    throw new TypeError(`Expected \`path\` to be a string, got ${typeof path}`)
  }

  try {
    const token = Cookies.get('t') || localStorage.getItem('token')
    const options = { headers: {}, ...fetchOptions }

    if (token) {
      options.headers.Authorization = `Bearer ${token}`
    }

    const response = await browser.runtime.sendMessage({
      action: ACTION_FETCH_FACEIT_API,
      path,
      options,
    })

    const {
      result, // Status for old API(?)
      code, // Status for new API(?)
      payload,
    } = response

    if (
      (result && result.toUpperCase() !== 'OK') ||
      (code && code.toUpperCase() !== 'OPERATION-OK')
    ) {
      throw new Error(response)
    }

    return camelcaseKeys(payload || response, {
      deep: true,
      ...camelcaseKeysOptions,
    })
  } catch (err) {
    console.error(err)

    return null
  }
}

const fetchApiMemoized = pMemoize(fetchApi, {
  maxAge: CACHE_TIME,
})

export const getUser = (userId) => fetchApiMemoized(`/users/v1/users/${userId}`)

export const getPlayer = (nickname) =>
  fetchApiMemoized(`/users/v1/nicknames/${nickname}`)

export const getPlayerMatches = (userId, game, size = 20) =>
  fetchApiMemoized(
    `/stats/v1/stats/time/users/${userId}/games/${game}?size=${size}`,
  )

export const getPlayerStats = async (userId, game, size = 20) => {
  if (!isSupportedGame(game)) {
    return false
  }

  let totalStats = await fetchApiMemoized(
    `/stats/v1/stats/users/${userId}/games/${game}`,
  )

  if (!totalStats || Object.keys(totalStats).length === 0) {
    return null
  }

  totalStats = mapTotalStatsMemoized(totalStats.lifetime)

  let averageStats = await fetchApiMemoized(
    `/stats/v1/stats/time/users/${userId}/games/${game}?size=${size}`,
  )

  if (!averageStats || !Array.isArray(averageStats)) {
    return null
  }

  averageStats = averageStats.filter((stats) => stats.gameMode.includes('5v5'))

  if (averageStats.length <= 1) {
    return null
  }

  averageStats = mapAverageStatsMemoized(averageStats)

  return {
    ...totalStats,
    ...averageStats,
  }
}

export const getMatch = (matchId) =>
  fetchApiMemoized(`/match/v2/match/${matchId}`)

export const getTeam = (teamId) => fetchApiMemoized(`/teams/v1/teams/${teamId}`)

export const getSelf = ({ memoized = true } = {}) => {
  const fetchFn = memoized ? fetchApiMemoized : fetchApi

  return fetchFn('/users/v1/sessions/me')
}

export const getHubQueue = async (id) =>
  (await fetchApi(`/queue/v1/queue/hub/${id}`))[0]

export const getPlayerHistory = async (userId, page = 0) => {
  const size = 50
  const offset = 0
  const from = encodeURIComponent('1970-01-01T01:00:00+0000')
  const to = encodeURIComponent(
    format(new Date(), `yyyy-MM-dd'T'HH:mm:ss'+0000'`),
  )

  return fetchApiMemoized(
    `/match-history/v5/players/${userId}/history/?from=${from}&to=${to}&page=${page}&size=${size}&offset=${offset}`,
  )
}

export const getMatchmakingQueue = (queueId) =>
  fetchApiMemoized(`/queue/v1/queue/matchmaking/${queueId}`)

export const getPlayerSummaries = (userIds) =>
  fetchApi(
    '/user-summary/v2/list',
    {
      method: 'POST',
      body: JSON.stringify({ ids: userIds }),
    },
    { exclude: userIds },
  )
