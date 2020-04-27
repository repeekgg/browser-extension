/** @jsx h */
/* eslint-disable react/jsx-child-element-spacing */
import select from 'select-dom'
import { h } from 'dom-chef'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { isLoggedIn } from '../helpers/user'

const FEATURE_ATTRIBUTE = 'stop-toxiciy'

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
          'font-size': 16,
          'text-align': 'center'
        }}
      >
        <a
          href="https://www.youtube.com/embed/GhEisp_JbXA?autoplay=1&amp;start=19"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'red' }}
        >
          <div>Stop Toxicity</div>
          <div style={{ 'font-size': 10 }}>
            Banned from FACEIT Enhancer
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
