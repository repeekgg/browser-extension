import OptionsSync from 'webext-options-sync'
import browser from 'webextension-polyfill'
import changelogs from '../libs/changelogs'

new OptionsSync().define({
  defaults: {
    partyAutoAcceptInvite: false,
    matchQueueAutoReady: false,
    matchRoomShowPlayerStats: false
  },
  migrations: [
    options => {
      if (options.autoAcceptPartyInvite === true) {
        options.partyAutoAcceptInvite = true
      }

      if (options.autoReadyMatch === true) {
        options.matchQueueAutoReady = true
      }

      if (options['matchRoom.showPlayerStats'] === true) {
        options.matchRoomShowPlayerStats = true
      }
    },
    OptionsSync.migrations.removeUnused
  ]
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
        url: changelogUrl
      })
    }
  }
})
