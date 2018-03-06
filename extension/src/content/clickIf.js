import settings from './settings'
import { select } from './utils'

export default function clickIf(option, selector) {
  if (settings[option]) {
    const el = select(selector)
    if (el) {
      el.click()
    }
  }
}
