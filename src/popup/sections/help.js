import { detect } from 'detect-browser'
import React from 'react'
import browser from 'webextension-polyfill'
import ListItemLink from '../components/list-item-link'
import ListSubheader from '../components/list-subheader'

const userBrowser = detect()

export const HELP = 'Help'

export default () => (
  <React.Fragment>
    <ListSubheader>Issues/Questions?</ListSubheader>
    <ListItemLink primary="Join our Discord" href="https://rpk.gg/discord" />
    <ListItemLink primary="Tweet Us" twitter="repeekgg" />
  </React.Fragment>
)
