import throttle from 'lodash/throttle'
import browser from 'webextension-polyfill'
import storage from '../../shared/storage'

export const isFeatureEnabled = async (option) => {
  const options = await storage.getAll()
  const featureEnabled = Array.isArray(option)
    ? option.some((opt) => options[opt])
    : options[option]

  return featureEnabled
}

export const runFeatureIf = async (option, feature, parent) => {
  const featureEnabled = await isFeatureEnabled(option)

  if (featureEnabled) {
    return feature(parent)
  }
}

export const notifyIf = throttle(async (option, message) => {
  const options = await storage.getAll()

  if (!options.notifyDisabled && options[option]) {
    browser.runtime.sendMessage({
      action: 'notification',
      ...message,
    })
  }
}, 500)
