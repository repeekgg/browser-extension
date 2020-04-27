import ky from 'ky'

const BASE_URL = 'https://api.faceit-enhancer.com'

const api = ky.extend({ prefixUrl: BASE_URL })

export const fetchBan = guid => api(`bans?guid=${guid}`).json()

export const fetchVips = guids =>
  api(`vips?guid=${Array.isArray(guids) ? guids.join('&guid=') : guids}`).json()

export default api
