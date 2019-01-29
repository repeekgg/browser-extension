import addDays from 'date-fns/add_days'
import addWeeks from 'date-fns/add_weeks'
import addMonths from 'date-fns/add_months'
import dateIsAfter from 'date-fns/is_after'
import formatDate from 'date-fns/format'
import { getSelf } from '../libs/faceit'
import bans from './bans'

export default async () => {
  try {
    const self = await getSelf()

    const bannedUser = bans.find(ban => ban.guid === self.guid)

    if (!bannedUser) {
      return false
    }

    const { startDate, days, weeks, months } = bannedUser
    let endDate

    if (days) {
      endDate = addDays(startDate, days)
    } else if (weeks) {
      endDate = addWeeks(startDate, weeks)
    } else if (months) {
      endDate = addMonths(startDate, months)
    }

    if (dateIsAfter(new Date(), endDate)) {
      return false
    }

    bannedUser.endDate = formatDate(endDate, 'YYYY-MM-DD')

    return bannedUser
  } catch (e) {
    console.error(e)
    return false
  }
}
