import test from 'ava'
import { mapTotalStats, mapAverageStats } from '../src/content/libs/stats'

test('mapTotalStats', t => {
  const stats = {
    m1: 1,
    k6: 2,
    unnecessary: true
  }

  t.deepEqual(mapTotalStats(stats), { matches: stats.m1, winRate: stats.k6 })
})

test('mapAverageStats', t => {
  const createStat = (c2, c3, c4, i6) => ({
    c2: c2.toString(),
    c3: c3.toString(),
    c4: c4.toString(),
    i6: i6.toString(),
    unnecessary: true
  })

  const stats = [
    createStat(0.25, 0.27, 20, 6),
    createStat(0.44, 0.32, 12, 8),
    createStat(0.36, 0.41, 19, 9)
  ]

  t.deepEqual(mapAverageStats(stats), {
    averageKDRatio: 0.35,
    averageKRRatio: 0.33,
    averageHeadshots: 17,
    averageKills: 8
  })
})
