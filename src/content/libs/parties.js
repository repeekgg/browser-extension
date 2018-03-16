/* eslint-disable import/prefer-default-export */

export function mapPartiesToColors(party, isFaction1) {
  const palette = ['#0082c8', '#ffe119', '#808080', '#3cb44b', '#e6194b']

  const colors = party.reduce(
    (acc, curr) => {
      const color = isFaction1 ? palette.shift() : palette.pop()

      return curr.activeTeamId && !acc.party[curr.activeTeamId]
        ? {
            ...acc,
            party: {
              ...acc.party,
              [curr.activeTeamId]: color
            }
          }
        : {
            ...acc,
            solo: {
              ...acc.solo,
              [curr.guid]: color
            }
          }
    },
    { party: {}, solo: {} }
  )

  return colors
}
