import select from 'select-dom'
import sorted from 'is-sorted'

export default async parent => {
  const tbody = select('.roster-selection__table tbody', parent)

  const rows = select.all('tr', tbody)
  if (sorted(rows, comparator)) return

  rows.sort(comparator)
  rows.forEach(el => {
    tbody.appendChild(el)
  })
}

const comparator = (a, b) => {
  const aName = getNickname(a)
  const bName = getNickname(b)

  if (aName < bName) return -1
  if (aName > bName) return 1
  return 0
}

const getNickname = el =>
  select('.roster-selection__table__name', el).innerText.toUpperCase()
