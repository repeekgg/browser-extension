import select from 'select-dom'
import {
  hasFeatureAttribute,
  setFeatureAttribute,
  setStyle
} from '../libs/dom-element'

const FEATURE_ATTRIBUTE = 'move-search'

export default async parent => {
  let searchElement = select('.search-solr', parent)

  if (!searchElement) {
    return
  }

  if (hasFeatureAttribute(searchElement, FEATURE_ATTRIBUTE)) {
    return
  }
  setFeatureAttribute(searchElement, FEATURE_ATTRIBUTE)

  searchElement = searchElement.parentElement

  searchElement.remove()

  const targetElement = select(
    '.main-header__left div[ng-if="vm.currentUserStore.currentUser"]',
    parent
  )

  setStyle(searchElement, 'margin-left: 10px')

  targetElement.append(searchElement)
}
