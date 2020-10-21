/** @jsx h */
/* eslint-disable react/jsx-child-element-spacing */
import select from 'select-dom'
import { h } from 'dom-chef'
import {
  hasFeatureAttribute,
  setFeatureAttribute
} from '../helpers/dom-element'
import { isLoggedIn } from '../helpers/user'

const FEATURE_ATTRIBUTE = Math.random()
  .toString(36)
  .substr(2, 9)

export default async bannedUser => {
  const observer = new MutationObserver(() => {
    if (bannedUser.shadow || !isLoggedIn()) {
      return
    }

    const headerRightElement = select(atob('Lm1haW4taGVhZGVyX19yaWdodA=='))

    if (!headerRightElement) {
      return
    }

    if (hasFeatureAttribute(FEATURE_ATTRIBUTE, headerRightElement)) {
      return
    }
    setFeatureAttribute(FEATURE_ATTRIBUTE, headerRightElement)

    const stopToxicityElement = (
      <div
        style={JSON.parse(
          atob(
            'eyJtYXJnaW4tcmlnaHQiOjgsIm1hcmdpbi1sZWZ0IjoyNCwibWFyZ2luLWJvdHRvbSI6NCwiZm9udC1zaXplIjoxNiwidGV4dC1hbGlnbiI6ImNlbnRlciIsICJjb2xvciI6ICJyZWQifQ=='
          )
        )}
      >
        <div>{atob('U3RvcCBUb3hpY2l0eQ==')}</div>
        <div style={JSON.parse(atob('eyJmb250LXNpemUiOjEwfQ=='))}>
          {atob('QmFubmVkIGZyb20gRkFDRUlUIEVuaGFuY2Vy')}
          <br />
          {atob('dW50aWw=')} {bannedUser.endDate}
        </div>
      </div>
    )

    headerRightElement.insertBefore(
      stopToxicityElement,
      headerRightElement.children[headerRightElement.children.length - 1]
    )
  })

  observer.observe(document.body, { childList: true, subtree: true })
}
