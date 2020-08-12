export const getPlatformFromTab = attr => {
  const match = (attr || '').match(/profile\.socials\.([^.]+)\.value/)

  return match === null || match[1] === undefined ? null : match[1]
}

export const validateSocialLink = (platform, link) => {
  switch (platform) {
    case 'facebook':
      return /http(s|):\/\/(www\.|)facebook\.com\/.+/g.test(link)
    case 'twitter':
      return /http(s|):\/\/(www\.|)twitter\.com\/.+/g.test(link)
    case 'youtube':
      return /http(s|):\/\/(www\.|)youtube\.com\/(user|channel)\/.+/g.test(link)
    default:
      return true
  }
}
