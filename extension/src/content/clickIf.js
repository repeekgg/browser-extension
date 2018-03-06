import { select } from './utils'
import storage from '../storage'

async function clickIf(option, selector) {
  if (await storage.get(option)) {
    const el = select(selector)
    if (el) {
      el.click()
    }
  }
}

export default clickIf
