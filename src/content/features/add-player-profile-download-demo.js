/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import styleInject from 'style-inject'
import get from 'lodash-es/get'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { getRoomId } from '../libs/match-room'
import { getQuickMatch, getMatch } from '../libs/faceit'

const FEATURE_ATTRIBUTE = 'demo-download'

styleInject(`
  .match-history-stats__row th:nth-last-child(3) .entry {
    text-align: right;
  }

  .match-history-stats__row td:nth-last-child(2) {
    width: 1px;
  }

  .match-history-stats__row td:nth-last-child(3) .entry {
    text-align: right;
  }

  .match-history-stats__row td:nth-last-child(3) .entry img {
    height: 40px;
    padding-left: 5px;
  }
`)

export default async parentElement => {
  const matchHistoryElement = select(
    'div.js-match-history-stats',
    parentElement
  )

  if (!matchHistoryElement) {
    return
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

    const accordionElement = matchElement.nextElementSibling
    const goToMatchRoomElement = select(
      'a[ui-sref*="app.root.matchroom.main.overview"]',
      accordionElement
    )

    const matchId = getRoomId(goToMatchRoomElement.getAttribute('href'))

    const downloadButtonElement = (
      <td>
        <button
          className="btn btn-default btn--with-icon mb-sm"
          type="button"
          onClick={async () => {
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
        </button>
      </td>
    )

    matchElement.insertBefore(
      downloadButtonElement,
      matchElement.children[matchElement.children.length - 1]
    )

    const accordionCellElement = select(
      '.match-history-stats__accordion__cell',
      accordionElement
    )
    accordionCellElement.setAttribute('colspan', 7)
  })
}
