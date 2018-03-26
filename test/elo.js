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
    lossPoints: -0
  })

  t.is(calculateRatingChange(1853, 1159).winPoints, 10)
  t.is(calculateRatingChange(1836, 1726).winPoints, 17)
  t.is(calculateRatingChange(1813, 1789).winPoints, 23)
  t.is(calculateRatingChange(1750, 1669).lossPoints, -31)
  t.is(calculateRatingChange(1775, 1602).winPoints, 13)
  t.is(calculateRatingChange(1754, 1703).winPoints, 21)
  t.is(calculateRatingChange(1781, 1685).lossPoints, -32)
  t.is(calculateRatingChange(1811, 1746).lossPoints, -30)
  t.is(calculateRatingChange(1877, 1875).lossPoints, -25)
  t.is(calculateRatingChange(1871, 1870).winPoints, 25)
  t.is(calculateRatingChange(1727, 1639).lossPoints, -31)
})

test.failing('calculateRatingChange is off by +-1', t => {
  t.is(calculateRatingChange(1789, 1865).winPoints, 31) // Actual: 30
  t.is(calculateRatingChange(1907, 1816).lossPoints, -32) // Actual: -31
  t.is(calculateRatingChange(1787, 1783).winPoints, 24) // Actual: 25
  t.is(calculateRatingChange(1781, 1721).winPoints, 20) // Actual: 21,
  t.is(calculateRatingChange(2043, 1939).lossPoints, -33) // Actual: -32
  t.is(calculateRatingChange(2134, 2073).lossPoints, -30) // Actual: -29
})
