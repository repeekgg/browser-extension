import ky from 'ky'

const BASE_URL = LOCAL_API ? 'http://localhost:3000' : 'https://api.repeek.gg'

const api = ky.extend({ prefixUrl: BASE_URL })

export const fetchVips = (guids) =>
  api(`vips?guid=${Array.isArray(guids) ? guids.join('&guid=') : guids}`).json()

export const fetchConfig = () => api('config').json()

export default api
