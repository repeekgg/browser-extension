const BASE_URL = 'https://api.faceit.com'

const playersCache = new Map()

export async function getPlayer(nickname) {
  if (playersCache.has(nickname)) {
    return playersCache.get(nickname)
  }

  const res = await fetch(`${BASE_URL}/core/v1/nicknames/${nickname}`)
  const { result, payload } = await res.json()

  if (result !== 'ok') {
    throw new Error(json)
  }

  playersCache.set(nickname, payload)

  return payload
}
