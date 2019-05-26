import React from 'react'
import ListSubheader from '../components/list-subheader'
import ListItemLink from '../components/list-item-link'
import ListItemText from '../components/list-item-text'

export const DONATE = 'Donate'

export default () => (
  <React.Fragment>
    <ListSubheader>Donate</ListSubheader>
    <ListItemText
      secondary={
        'We develop this extension in our free time, so donations are very much appreciated, but will never be asked for. Donators who donate at least 3 Euros will get an exclusive "FACEIT Enhancer VIP" badge displayed in the match room. Please include a link to your FACEIT profile in your donation to obtain your badge. Thanks for the support.'
      }
    />
    <ListItemLink primary="PayPal.me" href="https://www.paypal.me/timcheung" />
    <ListItemLink
      primary="BuyMeACoffee.com"
      href="https://www.buymeacoffee.com/timche"
    />
    <ListItemLink
      primary="TipeeeStream"
      href="https://www.tipeeestream.com/azn-1/donation"
    />
    <ListItemLink primary="Patreon" href="https://www.patreon.com/timche" />
  </React.Fragment>
)
