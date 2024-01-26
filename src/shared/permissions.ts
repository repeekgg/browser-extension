import browser from 'webextension-polyfill'

const REQUIRED_PERMISSIONS = [
  'https://www.faceit.com/*',
  'https://api.faceit.com/*',
]

const OPTIONAL_PERMISSONS = ['https://beta.faceit.com/*']

export async function getHasRequiredPermissions() {
  const permissions = await browser.permissions.getAll()

  return (
    permissions.origins?.indexOf(REQUIRED_PERMISSIONS[0]) !== -1 &&
    permissions.origins?.indexOf(REQUIRED_PERMISSIONS[1]) !== -1
  )
}

export function requestAllPermissions() {
  return browser.permissions.request({
    origins: [...REQUIRED_PERMISSIONS, ...OPTIONAL_PERMISSONS],
  })
}
