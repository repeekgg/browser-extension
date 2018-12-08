import select from 'select-dom'

export const getNickname = parent =>
  select('.roster-selection__table__name', parent).innerText

export const isMemberSelected = parent =>
  select('input[type="checkbox"]', parent).checked
