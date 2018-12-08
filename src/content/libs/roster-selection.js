/* eslint-disable import/prefer-default-export */
import select from 'select-dom'

export const getNickname = parent =>
  select('.roster-selection__table__name', parent).innerText
