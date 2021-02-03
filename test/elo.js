import test from 'ava'
import { estimateRatingChange } from '../src/content/helpers/elo'

test('estimateRatingChange', t => {
  t.deepEqual(estimateRatingChange(2000, 2000), {
    gain: 25,
    loss: -25
  })

  t.deepEqual(estimateRatingChange(5000, 1000), {
    gain: 1,
    loss: -50
  })

  t.deepEqual(estimateRatingChange(1000, 5000), {
    gain: 50,
    loss: -1
  })

  t.is(estimateRatingChange(1853, 1159).gain, 1)
  t.is(estimateRatingChange(1836, 1726).gain, 17)
  t.is(estimateRatingChange(1813, 1789).gain, 23)
  t.is(estimateRatingChange(1750, 1669).loss, -31)
  t.is(estimateRatingChange(1775, 1602).gain, 13)
  t.is(estimateRatingChange(1754, 1703).gain, 21)
  t.is(estimateRatingChange(1781, 1685).loss, -32)
  t.is(estimateRatingChange(1811, 1746).loss, -30)
  t.is(estimateRatingChange(1877, 1875).loss, -25)
  t.is(estimateRatingChange(1871, 1870).gain, 25)
  t.is(estimateRatingChange(1727, 1639).loss, -31)
})

test.failing('estimateRatingChange is off by +-1', t => {
  t.is(estimateRatingChange(1789, 1865).gain, 31) // Actual: 30
  t.is(estimateRatingChange(1907, 1816).loss, -32) // Actual: -31
  t.is(estimateRatingChange(1787, 1783).gain, 24) // Actual: 25
  t.is(estimateRatingChange(1781, 1721).gain, 20) // Actual: 21,
  t.is(estimateRatingChange(2043, 1939).loss, -33) // Actual: -32
  t.is(estimateRatingChange(2134, 2073).loss, -30) // Actual: -29
})
