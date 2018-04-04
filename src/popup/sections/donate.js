import React from 'react'
import { name } from '../../manifest'
import ListSubheader from '../components/list-subheader'
import ListItemText from '../components/list-item-text'
import ListItemLink from '../components/list-item-link'

export const DONATE = 'Donate'

export default () => (
  <React.Fragment>
    <ListSubheader>Support {name}</ListSubheader>
    <ListItemText
      secondary={`If you are satisfied with ${name} and want to support the extension and further development, donations are appreciated, but never asked.`}
    />
    <ListItemLink
      primary="PayPal"
      secondary="Buy me a drink to stay hydrated during developing :)"
      href="https://paypal.me/timcheung"
    />
    <ListItemLink
      primary="paysafecard, MasterCard/VISA, Sofortueberweisung, giropay"
      secondary="Buy me a snack to stay saturated during developing :)"
      href="https://www.tipeeestream.com/azn-1/donation"
    />
    <ListItemLink
      primary="Steam Trade Offer"
      secondary="Gift me CS:GO/PUBG skins, games or whatever to have some fun beside developing :)"
      steamCommunity="tradeoffer/new/?partner=238736&token=IGhRvdeN"
    />
    <ListSubheader divider>Thanks for Your Donations!</ListSubheader>
    <ListItemLink primary="zwck" secondary="5 EUR" faceit="zwacki" />
    <ListItemLink primary="hAnnah_f" secondary="3.82 EUR" faceit="hAnnah_f" />
    <ListItemLink
      primary="shiroatata"
      secondary="CS:GO Skins"
      faceit="hentaidemon"
    />
    <ListItemLink primary="kidi" secondary="CS:GO Skins" faceit="bykidi" />
    <ListItemLink primary="Bymas" secondary="PUBG Skins" faceit="Bymas" />
  </React.Fragment>
)
