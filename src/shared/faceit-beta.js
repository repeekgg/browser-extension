import browser from 'webextension-polyfill'

const FACEIT_BETA_HOST = 'beta.faceit.com'

const FACEIT_BETA_CONTENT_SCRIPT_ID = 'faceit-beta'

export const FACEIT_BETA_CONTENT_SCRIPT_MATCH_PATTERN = `https://${FACEIT_BETA_HOST}/*`

export const IS_FACEIT_BETA =
  typeof window !== 'undefined' && window.location.host === FACEIT_BETA_HOST

const FACEIT_BETA_ORIGIN_PERMISSION = {
  origins: [FACEIT_BETA_CONTENT_SCRIPT_MATCH_PATTERN],
}

export function getHasFaceitBetaHostPermission() {
  return browser.permissions.contains(FACEIT_BETA_ORIGIN_PERMISSION)
}

export function requestFaceitBetaHostPermission() {
  return browser.permissions.request(FACEIT_BETA_ORIGIN_PERMISSION)
}

export async function getIsFaceitBetaContentScriptRegistered() {
  const registeredContentScripts =
    await browser.scripting.getRegisteredContentScripts({
      ids: [FACEIT_BETA_CONTENT_SCRIPT_ID],
    })

  let isFaceitBetaContentScriptRegistered = false

  for (const registeredContentScript of registeredContentScripts) {
    if (registeredContentScript.id === FACEIT_BETA_CONTENT_SCRIPT_ID) {
      isFaceitBetaContentScriptRegistered = true
    }

    break
  }

  return isFaceitBetaContentScriptRegistered
}

export function registerFaceitBetaContentScript() {
  return browser.scripting.registerContentScripts([
    {
      id: FACEIT_BETA_CONTENT_SCRIPT_ID,
      runAt: 'document_start',
      matches: [FACEIT_BETA_CONTENT_SCRIPT_MATCH_PATTERN],
      js: ['content.js'],
      css: ['fonts.css'],
    },
  ])
}
