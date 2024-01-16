import select from 'select-dom'
import createFeaturedPlayerBadgeElement from '../components/player-badge'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getMatch } from '../helpers/faceit-api'
import { getRoomId } from '../helpers/match-room'
import { getPlayerBadges } from '../helpers/player-badges'

const FEATURE_ATTRIBUTE = 'match-room-player-badges'

export default async () => {
  const matchRoomContentElement = select(
    '#MATCHROOM-OVERVIEW > div:nth-child(3)',
  )

  if (
    !matchRoomContentElement ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomContentElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, matchRoomContentElement)

  const roomId = getRoomId()
  const match = await getMatch(roomId)

  const matchPlayers = [
    ...match.teams.faction1.roster,
    ...match.teams.faction2.roster,
  ]

  const matchPlayerBadges = await getPlayerBadges(
    matchPlayers.map((matchPlayer) => matchPlayer.id),
  )

  const matchPlayerElements = ['roster1', 'roster2']
    .reduce(
      (acc, roster) => [
        ...acc,
        ...select.all(
          `div[name="${roster}"] div > div:first-child > div > div > div[size="40"]`,
          matchRoomContentElement,
        ),
      ],
      [],
    )
    .map(
      (avatarElement) =>
        avatarElement.parentElement.parentElement.parentElement.parentElement,
    )

  matchPlayerElements.forEach((matchPlayerElement) => {
    const matchPlayerNicknameElement = select(
      'div:nth-child(2) > div > div',
      matchPlayerElement,
    )

    const playerBadge =
      matchPlayerBadges[
        matchPlayers.find(
          (matchPlayer) =>
            matchPlayer.nickname === matchPlayerNicknameElement.innerText,
        )?.id
      ]

    if (playerBadge) {
      const playerBadgeElement = createFeaturedPlayerBadgeElement(playerBadge)

      const matchPlayerInfoElement = select(
        'div:nth-child(2) > div',
        matchPlayerElement,
      )

      matchPlayerInfoElement.prepend(playerBadgeElement)
    }
  })
}
