export function createPathname(path) {
  const language = window.location.pathname.split('/')[1]

  return `/${language}/${path}`
}

export function navigateTo(path) {
  history.pushState({}, '', createPathname(path))
}
