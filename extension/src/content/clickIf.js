import { select } from './utils'
import storage from '../storage'

function clickElement(selector, target) {
  const element = target.querySelector(selector)

  if (element) {
    element.click()
  }
}

async function clickIf(option, selector, target) {
  if (await storage.get(option)) {
    Array.isArray(selector)
      ? selector.forEach(selector => clickElement(selector, target))
      : clickElement(selector, target)
  }
}

export default clickIf
