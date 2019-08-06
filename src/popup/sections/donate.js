import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import Typography from '@material-ui/core/Typography'
import ListSubheader from '../components/list-subheader'
import ListItemLink from '../components/list-item-link'
import ListItemText from '../components/list-item-text'
import vipLevels from '../../libs/vip-levels'

export const DONATE = 'Donate'

const VIPBadge = ({ level, bgColor, textColor }) => (
  <span
    style={{
      padding: '2px 4px',
      fontSize: 10,
      fontWeight: 'bold',
      borderRadius: 2,
      backgroundColor: bgColor,
      color: textColor
    }}
  >
    FACEIT Enhancer VIP{' '}
    {level > 0 ? new Array(level).fill(String.fromCharCode(9733)).join('') : ''}
  </span>
)

export default () => (
  <React.Fragment>
    <ListSubheader>Donate</ListSubheader>
    <ListItemText primary="We develop FACEIT Enhancer in our free time, so donations are very much appreciated, but will never be asked for." />
    <ListItemText
      secondary={
        'To appreciate your support, a donation of >= 3 Euros will get you an exclusive "FACEIT Enhancer VIP" badge displayed in the match room.'
      }
    />
    <ListItemText secondary="There are different badge levels based on the donation amount:" />
    {Object.keys(vipLevels)
      .map(Number)
      .map(vipLevel => (
        <ListItem style={{ display: 'block' }} key={vipLevel}>
          <Typography
            color="textSecondary"
            variant="caption"
            style={{ marginBottom: 2 }}
          >
            {vipLevel === 0
              ? 'Basic: >= 3 Euros'
              : `Level ${vipLevel}: >= ${vipLevel}0 Euros`}
          </Typography>
          <VIPBadge level={vipLevel} {...vipLevels[vipLevel]} />
        </ListItem>
      ))}
    <ListItemText secondary="Please include a link to your FACEIT profile in your donation to obtain your badge." />
    <ListItemLink primary="PayPal.me" href="https://www.paypal.me/timcheung" />
    <ListItemLink
      primary="BuyMeACoffee.com"
      href="https://www.buymeacoffee.com/timche"
    />
    <ListItemText secondary="Thanks for your support." />
  </React.Fragment>
)
