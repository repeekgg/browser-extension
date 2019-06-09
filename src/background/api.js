import ky from 'ky'

const BASE_URL = 'https://api.faceit-enhancer.com'

const api = ky.extend({ prefixUrl: BASE_URL })

export const fetchBans = () => api('bans').json()

export const fetchVips = () => api('vips').json()

export default api
