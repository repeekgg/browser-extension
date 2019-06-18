import addMonths from 'date-fns/add_months'
import dateIsAfter from 'date-fns/is_after'
import formatDate from 'date-fns/format'
import { getSelf } from '../libs/faceit'
import store from '../store'

export default async () => {
  try {
    const self = await getSelf()

    const bans = store.get('bans')
    const bannedUser = bans.find(ban => ban.guid === self.guid)

    if (!bannedUser) {
      return false
    }

    const { startDate, months } = bannedUser

    const endDate = addMonths(startDate, months)

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
