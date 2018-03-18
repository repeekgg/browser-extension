import test from 'ava'
import { calculateRatingChange } from '../src/content/libs/elo'

test('calculateRatingChange', t => {
  t.deepEqual(calculateRatingChange(0.5), {
    winPoints: 25,
    lossPoints: -25
  })
})
