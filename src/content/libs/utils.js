/* eslint-disable import/prefer-default-export */
import browser from 'webextension-polyfill'
import storage from '../../libs/storage'

export const runFeatureIf = async (option, feature, parent) => {
  const options = await storage.getAll()
  if (options[option]) {
    feature(parent)
  }
}

export const notifyIf = async (option, message) => {
  const options = await storage.getAll()

  if (options[option]) {
    browser.runtime.sendMessage({
      action: 'notification',
      ...message
    })
  }
}
