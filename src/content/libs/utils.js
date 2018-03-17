/* eslint-disable import/prefer-default-export */
import storage from '../../libs/storage'

export const runFeatureIf = async (option, feature, parent) => {
  const options = await storage.getAll()
  if (options[option]) {
    feature(parent)
  }
}
