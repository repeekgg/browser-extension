/** @jsx h */
/* eslint-disable react/jsx-child-element-spacing */
import select from 'select-dom'
import { h } from 'dom-chef'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'
import { isLoggedIn } from '../libs/utils'

const FEATURE_ATTRIBUTE = 'stop-toxiciy'
const STOP_TOXICITY_URL =
  'https://twitter.com/TheNorthIsHere/status/1088845523560353792'

export default async bannedUser => {
  const observer = new MutationObserver(() => {
    if (!isLoggedIn()) {
      return
    }

    const headerRightElement = select('.main-header__right')

    if (!headerRightElement) {
      return
    }

    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, headerRightElement)) {
      return
    }
    setFeatureAttribute(FEATURE_ATTRIBUTE, headerRightElement)

    const stopToxicityElement = (
      <div
        style={{
          'margin-right': 8,
          'margin-left': 24,
          'margin-bottom': 4,
          'font-size': 18,
          'text-align': 'center'
        }}
      >
        <a
          href={STOP_TOXICITY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'red' }}
        >
          <div>#StopToxicity</div>
          <div style={{ 'font-size': 6 }}>
            Banned from using FACEIT Enhancer
            <br />
            until {bannedUser.endDate}
          </div>
        </a>
      </div>
    )

    headerRightElement.insertBefore(
      stopToxicityElement,
      headerRightElement.children[headerRightElement.children.length - 1]
    )
  })

  observer.observe(document.body, { childList: true, subtree: true })
}
