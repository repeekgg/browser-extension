/* eslint-disable import/prefer-default-export */
import browser from 'webextension-polyfill'
import select from 'select-dom'
import storage from '../../libs/storage'

export const runFeatureIf = async (option, feature, parent) => {
  const options = await storage.getAll()
  const featureEnabled = Array.isArray(option)
    ? option.some(opt => options[opt])
    : options[option]
  if (featureEnabled) {
    feature(parent)
  }
}

export const notifyIf = async (option, message) => {
  const options = await storage.getAll()

  if (!options.notifyDisabled && options[option]) {
    browser.runtime.sendMessage({
      action: 'notification',
      ...message
    })
  }
}

export const isLoggedIn = async () => {
  const mainHeaderRightLoggedOut = select('.main-header__right__logged-out')

  if (mainHeaderRightLoggedOut) {
    return false
  }

  return true
}
