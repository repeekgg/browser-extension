import test from 'ava'
import { calculateRatingChange } from '../src/content/libs/elo'

test('calculateRatingChange', t => {
  t.deepEqual(calculateRatingChange(2000, 2000), {
    winPoints: 25,
    lossPoints: -25
  })

  t.deepEqual(calculateRatingChange(5000, 1000), {
    winPoints: 10,
    lossPoints: -50
  })

  t.deepEqual(calculateRatingChange(1000, 5000), {
    winPoints: 50,
    lossPoints: -10
  })
})
