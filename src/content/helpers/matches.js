/* eslint-disable import/prefer-default-export */
import { normalizeElo } from './elo'
import { getMatchmakingQueue } from './faceit-api';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export async function mapMatchesWithElo(matches, game) {
  let eloEnabled = {}

  await asyncForEach(matches, async (match) => {
    if (match.competitionId) { // Note: Old matches won't have competitionId
      let queue = await getMatchmakingQueue(match.competitionId);
      eloEnabled[match.competitionId] = queue.length > 0 ? queue[0].calculateElo : false;
    }
  })

  const matchesByGame = matches.filter(match => {
      //match.game === game
      //console.log(eloEnabled[match.competitionId] + ' ' + match.competitionId)
      return match.game === game && eloEnabled[match.competitionId]
    }
  )

  if (matchesByGame.length === 0) {
    return null
  }

  return matchesByGame.reduce((acc, { matchId, elo, ...match }, i) => {
    if (matchesByGame.length === i + 1) {
      return acc
    }

    const eloBefore = normalizeElo(matchesByGame[i + 1].elo)
    const eloAfter = normalizeElo(elo)
    const eloDiff = eloBefore && eloAfter ? eloAfter - eloBefore : null

    return {
      ...acc,
      [matchId]: {
        ...match,
        eloBefore,
        eloAfter,
        eloDiff
      }
    }
  }, {})
}
