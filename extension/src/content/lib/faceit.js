const BASE_URL = 'https://api.faceit.com'

async function fetchApi(path) {
  if (typeof path !== 'string') {
    throw new TypeError(`Expected \`path\` to be a string, got ${typeof path}`)
  }

  const res = await fetch(`${BASE_URL}${path}`)

  const json = await res.json()
  const { result, payload } = json

  if (result !== 'ok') {
    throw new Error(json)
  }

  return payload
}

async function getData(path, cache, key) {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const res = await fetchApi(path)

  cache.set(key, res)

  return res
}

const playersCache = new Map()

export const getPlayer = nickname =>
  getData(`/core/v1/nicknames/${nickname}`, playersCache, nickname)
