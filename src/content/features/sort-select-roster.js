import select from 'select-dom'
import sorted from 'is-sorted'

import { getNickname } from '../libs/roster-selection'

const comparator = (a, b) => {
  const aName = getNickname(a).toUpperCase()
  const bName = getNickname(b).toUpperCase()

  if (aName < bName) return -1
  if (aName > bName) return 1
  return 0
}

export default async parent => {
  const tbody = select('.roster-selection__table tbody', parent)

  const rows = select.all('tr', tbody)
  if (sorted(rows, comparator)) return

  rows.sort(comparator)
  rows.forEach(el => {
    tbody.appendChild(el)
  })
}
