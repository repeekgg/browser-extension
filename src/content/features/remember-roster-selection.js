import select from 'select-dom'

import { getNickname, isMemberSelected } from '../libs/roster-selection'
import storage from '../../libs/storage'

const onSubmit = async () => {
  // HACK: We cannot access parent variable because this function would be
  // recreated on every call of rememberRosterSelection and duplicate
  // event listeners would be added
  const parent = select('.modal-dialog')

  const members = select
    .all('.roster-selection__table tbody tr', parent)
    .filter(el => isMemberSelected(el))
    .map(el => getNickname(el))

  await storage.set({ lastRosterSelection: members })
}

export default async parent => {
  const { lastRosterSelection } = await storage.getAll()

  const matchingRosterSelection = select
    .all('.roster-selection__table tbody tr', parent)
    .filter(el => lastRosterSelection.includes(getNickname(el)))

  if (matchingRosterSelection.length > 0) {
    await storage.set({ lastRosterSelection: [] })
    matchingRosterSelection.forEach(el => {
      if (isMemberSelected(el)) return
      select('.fi-checkbox', el).click()
    })
  }

  select('form', parent).addEventListener('submit', onSubmit)
}
