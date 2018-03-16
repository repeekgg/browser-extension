/* eslint-disable import/prefer-default-export */

import browser from 'webextension-polyfill'

export const runFeatureIf = async (
  option,
  feature,
  parent,
  store = browser.storage.sync
) => {
  const options = await store.get(option)
  if (options[option]) {
    feature(parent)
  }
}
