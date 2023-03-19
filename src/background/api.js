import ky from 'ky'

const BASE_URL = 'https://api.faceit-enhancer.com'

const api = ky.extend({ prefixUrl: BASE_URL })

const BANS = atob('YmFucw==')

export const fetchBan = guid => api(`${BANS}?guid=${guid}`).json()

export const fetchVips = guids =>
  api(`vips?guid=${Array.isArray(guids) ? guids.join('&guid=') : guids}`).json()

export const fetchConfig = () => api('config').json()

export default api
