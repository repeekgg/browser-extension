/** @jsx h */
import { h } from 'dom-chef'
import styleInject from 'style-inject'
import select from 'select-dom'
import { hasFeatureAttribute, setFeatureAttribute } from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'hide-button'
const SIDEBAR_HIDDEN_WIDTH = '50px'
const SIDEBAR_HIDE_CLASS = 'faceit-enhancer-sidebar-hidden'

styleInject(`
  .sidebar.${SIDEBAR_HIDE_CLASS} {
    width: ${SIDEBAR_HIDDEN_WIDTH};
  }

  .sidebar.${SIDEBAR_HIDE_CLASS} .sidebar__content__view {
    display: none;
  }

  .main-content__wrapper.${SIDEBAR_HIDE_CLASS} {
    margin-left: ${SIDEBAR_HIDDEN_WIDTH};
  }
`)

export default async () => {
  const sidebarMenuElement = select('.sidebar__content__menu > div')

  if (!sidebarMenuElement) {
    return
  }

  if (hasFeatureAttribute(FEATURE_ATTRIBUTE, sidebarMenuElement)) {
    return
  }
  setFeatureAttribute(FEATURE_ATTRIBUTE, sidebarMenuElement)

  const dividerElement = <div className="divider" />

  sidebarMenuElement.append(dividerElement)

  let sidebarHidden = false
  const mainContentWrapperElement = select('.main-content__wrapper')
  const sidebarElement = select('#sidebar')

  const hideSidebarElement = (
    <div className="nav-icon">
      <div
        className="nav-icon__inner"
        onClick={() => {
          ;[sidebarElement, mainContentWrapperElement].forEach(element => {
            element.classList[sidebarHidden ? 'remove' : 'add'](
              SIDEBAR_HIDE_CLASS
            )
          })
          sidebarHidden = !sidebarHidden
        }}
      >
        <div className="nav-icon__icon">
          <i className="icon-menu" />
        </div>
      </div>
    </div>
  )

  sidebarMenuElement.append(hideSidebarElement)
}
