import test from 'ava'
import { mapMatchesByIdAndExtendElo } from '../src/content/libs/matches'

test('mapMatchesByIdAndExtendElo', t => {
  const matches = [
    {
      matchId: '123',
      elo: '1000'
    },
    {
      matchId: '456',
      elo: '1100'
    },
    {
      matchId: '789',
      elo: '1000'
    }
  ]

  t.deepEqual(mapMatchesByIdAndExtendElo(matches), {
    123: {
      newElo: 1000,
      oldElo: 1100,
      eloDiff: -100
    },
    456: {
      newElo: 1100,
      oldElo: 1000,
      eloDiff: 100
    }
  })
})
