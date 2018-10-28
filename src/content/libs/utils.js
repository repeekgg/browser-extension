/* eslint-disable import/prefer-default-export */
import browser from 'webextension-polyfill'
import select from 'select-dom'
import storage from '../../libs/storage'

export const isFeatureEnabled = async option => {
  const options = await storage.getAll()
  const featureEnabled = Array.isArray(option)
    ? option.some(opt => options[opt])
    : options[option]

  return featureEnabled
}

export const runFeatureIf = async (option, feature, parent) => {
  const featureEnabled = await isFeatureEnabled(option)

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

export const isLoggedIn = () =>
  !select.exists('.main-header__right__logged-out')
