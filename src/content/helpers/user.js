import select from 'select-dom'

export const isLoggedIn = () =>
  !select.exists('.main-header__right__logged-out')
