const BASE_URL = 'https://api.faceit.com'

const cache = new Map()

async function fetchApi(path) {
  if (typeof path !== 'string') {
    throw new TypeError(`Expected \`path\` to be a string, got ${typeof path}`)
  }

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
  const { result, payload } = json

  if (result !== 'ok') {
    throw new Error(json)
  }

  return payload
}

export const getPlayer = nickname => fetchApi(`/core/v1/nicknames/${nickname}`)

export const getPlayerStats = userId =>
  fetchApi(`/stats/v1/stats/users/${userId}/games/csgo`)

export const getMatch = matchId => fetchApi(`/core/v1/matches/${matchId}`)
