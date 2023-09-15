import test from 'ava'
import { mapTotalStats, mapAverageStats } from '../src/content/helpers/stats'

test('mapTotalStats', (t) => {
  const stats = {
    m1: 1,
    unnecessary: true
  }

  t.deepEqual(mapTotalStats(stats), { matches: stats.m1 })
})

test('mapAverageStats', (t) => {
  const createStat = (c2, c3, c4, i6, i2, teamId) => ({
    c2: c2.toString(),
    c3: c3.toString(),
    c4: c4.toString(),
    i6: i6.toString(),
    i2,
    teamId,
    unnecessary: true
  })

  const stats = [
    createStat(0.25, 0.27, 20, 6, '123', '123'),
    createStat(0.44, 0.32, 12, 8, '123', '345'),
    createStat(0.36, 0.41, 19, 9, '123', '123')
  ]

  t.deepEqual(mapAverageStats(stats), {
    averageKDRatio: 0.35,
    averageKRRatio: 0.33,
    averageHeadshots: 17,
    averageKills: 8,
    winRate: 67
  })
})
