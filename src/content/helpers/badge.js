import vipLevels from '../../shared/vip-levels'
import store from '../store'

export const defaultProfiles = [
  /* eslint-disable capitalized-comments */
  addPlayer('b144525f-8f41-4ea4-aade-77862b631bbc', 'Creator'), // azn
  addPlayer('a9f76105-4473-4870-a2c6-7f831e96edaf', 'Developer') // poacher2k
  /* eslint-enable capitalized-comments */
]

let playerBadges

function addPlayer(guid, role, bgColor, textColor, description, onClick) {
  return { guid, role, bgColor, textColor, description, onClick }
}

function addVIP({ guid, level = 0, role, bgColor, textColor }) {
  return addPlayer(
    guid,
    role || `VIP ${level > 0 ? new Array(level).fill('★').join('') : ''}`,
    bgColor || vipLevels[level].bgColor,
    textColor || vipLevels[level].textColor,
    `Has donated${
      level > 0 ? ` at least ${level}0 Euros ` : ' '
    }to support the development.`
  )
}

export function getPlayerBadges() {
  if (!playerBadges) {
    const vips = store.get('vips')

    playerBadges = [...defaultProfiles, ...vips.map(addVIP)]
  }

  return playerBadges
}

export function getPlayerBadgeByGuid(playerGuid) {
  const playerBadges = getPlayerBadges()

  return playerBadges.find(({ guid }) => guid === playerGuid)
}
