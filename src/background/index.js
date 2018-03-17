import browser from 'webextension-polyfill'
import OptionsSync from 'webext-options-sync'
import storage from '../libs/storage'
import changelogs from '../libs/changelogs'

const DEFAULTS = {
  partyAutoAcceptInvite: false,
  matchQueueAutoReady: false,
  matchRoomShowPlayerStats: false,
  matchRoomAutoCopyServerData: false,
  matchRoomAutoConnectToServer: false,
  notifyPartyAutoAcceptInvite: true,
  notifyMatchQueueAutoReady: true,
  notifyMatchRoomAutoConnectToServer: true
}

storage.define({
  defaults: DEFAULTS,
  migrations: [OptionsSync.migrations.removeUnused]
})

browser.runtime.onMessage.addListener(message => {
  if (!message) {
    return
  }

  if (message.action === 'notification') {
    const { name } = browser.runtime.getManifest()
    delete message.action

    browser.notifications.create('', {
      type: 'basic',
      ...message,
      contextMessage: name,
      iconUrl: 'icon.png'
    })
  }
})

browser.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === 'update') {
    const { installType } = await browser.management.getSelf()

    if (installType === 'development') {
      return
    }

    const { version } = browser.runtime.getManifest()
    const changelogUrl = changelogs[version]

    if (changelogUrl) {
      browser.tabs.create({
        url: changelogUrl,
        active: false
      })
    }
  }
})
