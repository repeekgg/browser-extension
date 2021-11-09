/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import get from 'lodash/get'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import {
  getQuickMatch,
  getMatch,
  getPlayer,
  getPlayerMatches
} from '../helpers/faceit-api'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame
} from '../helpers/player-profile'
import createButton from '../components/button'

const FEATURE_ATTRIBUTE = 'matches-demo'

export default async parentElement => {
  const playerProfileParasiteElement = select(
    'parasite-player-profile-content',
    parentElement
  )

  if (!playerProfileParasiteElement) {
    return
  }

  const playerProfileElement = select(
    '#__next > div',
    playerProfileParasiteElement.shadowRoot
  )

  const matchElements = select.all('table > tbody > tr', playerProfileElement)

  matchElements.shift()

  if (
    !playerProfileElement ||
    matchElements.length === 0 ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, playerProfileElement)
  ) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, playerProfileElement)

  const matchElementsHead = select('table > tbody > tr', playerProfileElement)

  matchElementsHead.append(
    <th
      style={{
        color: '#8c8c8c',
        padding: 8,
        marginBottom: 8,
        textAlign: 'left',
        width: 130
      }}
    >
      Demo
    </th>
  )

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const game = getPlayerProfileStatsGame()
  const matches = await getPlayerMatches(player.guid, game)

  matchElements.forEach(async (matchElement, index) => {
    const matchId = matches[index].matchId

    if (!matchId) {
      return
    }

    const downloadButtonElement = (
      <td
        style={{
          borderTop: '1px solid #676767',
          paddingLeft: 8,
          paddingRight: 8
        }}
      >
        {createButton({
          text: 'Watch Demo',
          onClick: async e => {
            e.stopPropagation()
            const match =
              (await getQuickMatch(matchId)) || (await getMatch(matchId))
            const demoUrl =
              get(match, 'externalMatches[0].stats.demoFileUrl') ||
              match.demoUrl ||
              match.demoUrLs[0]

            if (demoUrl) {
              window.open(demoUrl)
            }
          }
        })}
      </td>
    )

    matchElement.insertBefore(
      downloadButtonElement,
      matchElement.children[matchElement.children.length - 1]
    )
  })
}
