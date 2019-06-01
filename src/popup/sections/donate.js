import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemLink from '../components/list-item-link'
import ListItemText from '../components/list-item-text'

export const DONATE = 'Donate'

export default () => (
  <React.Fragment>
    <ListSubheader>Donate</ListSubheader>
    <ListItemText secondary="We develop this extension in our free time, so donations are very much appreciated, but will never be asked for." />
    <ListItemText
      secondary={
        'To appreciate your support, a donation of 3 Euros and more gets you an exclusive "FACEIT Enhancer VIP" badge displayed in the match room. The highest donation(s) get(s) a special badge. Please include a link to your FACEIT profile in your donation to obtain your badge.'
      }
    />
    <ListItemText secondary="Thanks for your support." />
    <ListItemLink primary="PayPal.me" href="https://www.paypal.me/timcheung" />
    <ListItemLink
      primary="BuyMeACoffee.com"
      href="https://www.buymeacoffee.com/timche"
    />
    <ListItemText secondary="Donations are non-refundable." />
  </React.Fragment>
)
