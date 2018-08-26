/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import styleInject from 'style-inject'
import get from 'lodash/get'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getRoomId } from '../libs/match-room'
import { getQuickMatch, getMatch } from '../libs/faceit'

const FEATURE_ATTRIBUTE = 'demo-download'

export default async parentElement => {
  const matchHistoryElement = select(
    'div.js-match-history-stats',
    parentElement
  )

  if (!matchHistoryElement) {
    return
  }

  if (!hasFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)) {
    styleInject(`
      .match-history-stats__row th:nth-last-child(3) .entry {
        text-align: right;
      }
      .match-history-stats__row td:nth-last-child(3) .entry {
        text-align: right;
      }
      .match-history-stats__row td:nth-last-child(3) .entry img {
        padding-left: 8px;
      }
    `)
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchHistoryElement)
  }

  const matchElements = select.all(
    'tbody > tr.match-history-stats__row',
    matchHistoryElement
  )

  if (matchElements.length === 0) {
    return
  }

  const matchElementsHead = select('thead > tr', matchHistoryElement)

  if (!hasFeatureAttribute(FEATURE_ATTRIBUTE, matchElementsHead)) {
    matchElementsHead.append(<th />)
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchElementsHead)
  }

  matchElements.forEach(async matchElement => {
    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, matchElement)) {
      return
    }
    setFeatureAttribute(FEATURE_ATTRIBUTE, matchElement)

    const matchId = getRoomId(matchElement.getAttribute('href'))

    const downloadButtonElement = (
      <td style={{ width: 1 }}>
        <a
          className="btn btn-default btn--with-icon mb-sm"
          onClick={async e => {
            e.stopPropagation()
            const match =
              (await getQuickMatch(matchId)) || (await getMatch(matchId))
            const demoUrl =
              get(match, 'externalMatches[0].stats.demoFileUrl') ||
              match.demoUrl
            if (demoUrl) {
              window.open(demoUrl)
            }
          }}
        >
          Watch Demo
        </a>
      </td>
    )

    matchElement.insertBefore(
      downloadButtonElement,
      matchElement.children[matchElement.children.length - 1]
    )
  })
}
