import { IS_PRODUCTION } from '../../shared/constants'

const logger = {
  debug(context, message) {
    if (IS_PRODUCTION === false) {
      console.log(`[${context}] ${message}`)
    }
  }
}

export default logger
