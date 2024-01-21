import React from 'dom-chef'
import get from 'lodash/get'
import select from 'select-dom'
import createButton from '../components/button'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
} from '../helpers/dom-element'
import { getMatch, getPlayer, getPlayerMatches } from '../helpers/faceit-api'
import {
  getPlayerProfileNickname,
  getPlayerProfileStatsGame,
} from '../helpers/player-profile'

const FEATURE_ATTRIBUTE = 'matches-demo'

export default async (statsContentElement) => {
  const matchElements = select.all('table > tbody > tr', statsContentElement)

  const matchElementsHead = matchElements.shift()

  if (
    matchElements.length === 0 ||
    !matchElementsHead ||
    hasFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)
  ) {
    return
  }

  setFeatureAttribute(FEATURE_ATTRIBUTE, statsContentElement)

  matchElementsHead.append(
    <th
      style={{
        color: '#8c8c8c',
        padding: 8,
        marginBottom: 8,
        textAlign: 'left',
        width: 160,
      }}
    >
      Demo
    </th>,
  )

  const nickname = getPlayerProfileNickname()
  const player = await getPlayer(nickname)
  const game = getPlayerProfileStatsGame()
  const matches = await getPlayerMatches(player.id, game, 30)

  matchElements.forEach((matchElement, index) => {
    const matchId = matches[index].matchId

    if (!matchId) {
      return
    }

    const downloadButtonElement = (
      <td
        style={{
          borderTop: '1px solid #676767',
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        {createButton({
          text: 'Watch Demo',
          onClick: async (e) => {
            e.stopPropagation()
            const match = await getMatch(matchId)
            const demoUrl =
              get(match, 'externalMatches[0].stats.demoFileUrl') ||
              match.demoUrl ||
              match.demoUrLs[0]

            if (demoUrl) {
              window.open(demoUrl)
            }
          },
        })}
      </td>
    )

    matchElement.children[
      matchElement.children.length - 1
    ].insertAdjacentElement('beforebegin', downloadButtonElement)
  })
}
