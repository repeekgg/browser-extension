import addMonths from 'date-fns/addMonths'
import dateIsAfter from 'date-fns/isAfter'
import formatDate from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import browser from 'webextension-polyfill'
import { ACTION_FETCH_BAN } from '../../shared/constants'
import { getSelf } from './faceit-api'

export default async () => {
  try {
    const { guid } = await getSelf()

    const bannedUser = await browser.runtime.sendMessage({
      action: ACTION_FETCH_BAN,
      guid
    })

    if (!bannedUser) {
      return false
    }

    const { startDate, months } = bannedUser

    const endDate = addMonths(parseISO(startDate), months)

    if (dateIsAfter(new Date(), endDate)) {
      return false
    }

    bannedUser.endDate = formatDate(endDate, 'yyyy-MM-dd')

    return bannedUser
  } catch (e) {
    return null
  }
}
