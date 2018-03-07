const BASE_URL = 'https://api.faceit.com'

const cache = new Map()

export async function getPlayer(nickname) {
  if (cache.has(nickname)) {
    return cache.get(nickname)
  }

  const res = await fetch(`${BASE_URL}/core/v1/nicknames/${nickname}`)
  const { result, payload } = await res.json()

  if (result !== 'ok') {
    throw new Error(json)
  }

  cache.set(nickname, payload)

  return payload
}
