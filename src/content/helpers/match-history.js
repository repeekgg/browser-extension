import { getPlayerHistory } from '../helpers/faceit-api'

const recursionLimit = 10
const matchesResults = {}

const getMatchHistory = async (playerId, totalMatches, recursionLevel = 0) => {
  if (recursionLevel >= recursionLimit) {
    throw new Error('Maximum recursion depth reached')
  }

  if (!matchesResults[playerId]) {
    matchesResults[playerId] = {
      page: -1,
      matches: [],
      pageRequests: {}
    }
  }

  const matchResult = matchesResults[playerId]

  if (matchResult.matches.length >= totalMatches) {
    return matchResult.matches
  }
  const nextPage = matchResult.page + 1

  if (matchResult.pageRequests[nextPage]) {
    return matchResult.pageRequests[nextPage]
  }

  const getPagePromise = new Promise(async (resolve, reject) => {
    try {
      const matches = await getPlayerHistory(playerId, nextPage)
      matchResult.page = nextPage
      matchResult.matches = matchResult.matches.concat(matches)

      resolve(getMatchHistory(playerId, totalMatches, recursionLevel + 1))
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })

  matchResult.pageRequests[nextPage] = getPagePromise

  return getPagePromise
}

export default getMatchHistory
