import test from 'ava'
import { calculateRatingChange } from '../src/content/libs/elo'

test('calculateRatingChange', t => {
  t.deepEqual(calculateRatingChange(2000, 2000), {
    winPoints: 25,
    lossPoints: -25
  })
})
