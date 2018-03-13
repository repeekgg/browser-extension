/* eslint-disable import/prefer-default-export */

// Incomplete map
//
// const stats = {
//   lifetime: {
//     m1: 'matches',
//     m2: 'matches_win',
//     m7: '',
//     m13: '',
//     k5: 'average_kd_ratio',
//     k6: 'win_rate',
//     k8: 'average_headshots',
//     s0: '',
//     s1: 'current_win_streak',
//     s2: 'longest_win_streak',
//     s3: '',
//     s4: '',
//     s5: '',
//     s6: '',
//     s7: ''
//   },
//   segments: [
//     {
//       segments: {
//         m1: 'matches',
//         m2: 'matches_win',
//         m3: 'kills',
//         m4: 'deaths', // ?
//         m5: 'assists', // ?
//         m6: '',
//         m7: '',
//         m8: '',
//         m9: '',
//         m10: 'triple_kills',
//         m11: 'quadro_kills',
//         m12: 'penta_kills',
//         m13: '',
//         m14: '',
//         k1: 'average_kills',
//         k2: 'average_deaths',
//         k3: 'average_assists',
//         k4: '',
//         k5: 'average_kd_ratio',
//         k6: 'win_rate',
//         k7: 'headshots_per_match',
//         k8: 'average_headshots',
//         k9: 'average_kr_ratio',
//         k10: 'average_triple_kills',
//         k11: 'average_quadro_kills',
//         k12: 'average_penta_kills'
//       }
//     }
//   ]
// }

// Only relevant stats for now
const STATS_MAP = {
  csgo: {
    lifetime: {
      m1: 'matches',
      k5: 'average_kd_ratio',
      k6: 'win_rate',
      k8: 'average_headshots'
    },
    segments: {
      k1: 'average_kills',
      k9: 'average_kr_ratio'
    }
  }
}

export function convertToHumanReadableStats(unreadableStats, game) {
  if (!STATS_MAP[game]) {
    return null
  }

  const stats = Object.keys(unreadableStats.lifetime).reduce((acc, curr) => {
    if (STATS_MAP[game].lifetime[curr]) {
      return {
        ...acc,
        [STATS_MAP[game].lifetime[curr]]: unreadableStats.lifetime[curr]
      }
    }

    return acc
  }, {})

  const maps = unreadableStats.segments.find(
    segment => segment._id.segmentId === 'csgo_map'
  ).segments
  const advancedStats = Object.keys(maps).reduce((acc, map, i) => {
    const stats = Object.keys(maps[map]).reduce((acc2, mapStat) => {
      if (STATS_MAP[game].segments[mapStat]) {
        return {
          ...acc2,
          [STATS_MAP[game].segments[mapStat]]: maps[map][mapStat]
        }
      }
      return acc2
    }, {})

    return Object.keys(stats).reduce((acc2, stat) => {
      let values = (acc2[stat] || []).concat(stats[stat])

      if (Object.keys(maps).length - 1 === i) {
        values = (
          values.reduce((acc3, value) => Number(value) + acc3, 0) /
          values.length
        ).toFixed(2)
      }

      return {
        ...acc2,
        [stat]: values
      }
    }, acc)
  }, {})

  return {
    ...stats,
    ...advancedStats
  }
}
