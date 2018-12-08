import select from 'select-dom'

import storage from '../../libs/storage'

export default async parent => {
  const { lastRosterSelection } = await storage.getAll()

  const matchingRosterSelection = select
    .all('.roster-selection__table tbody tr', parent)
    .filter(el => lastRosterSelection.includes(getNickname(el)))

  if (matchingRosterSelection.length) {
    await storage.set({ lastRosterSelection: [] })
    matchingRosterSelection.forEach(el => {
      if (getMemberSelected(el)) return
      select('.fi-checkbox', el).click()
    })
  }

  select('form', parent).addEventListener('submit', onSubmit)
}

const onSubmit = async () => {
  // HACK: We cannot access parent variable because this function would be
  // recreated on every call of rememberRosterSelection and duplicate
  // event listeners would be added
  const parent = select('.modal-dialog')

  const members = select
    .all('.roster-selection__table tbody tr', parent)
    .filter(el => getMemberSelected(el))
    .map(el => getNickname(el))

  await storage.set({ lastRosterSelection: members })
}

const getNickname = el => select('.roster-selection__table__name', el).innerText

const getMemberSelected = el => select('input[type="checkbox"]', el).checked
