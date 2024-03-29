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
    <ListItemLink
      primary="Report an Issue"
      subreddit={encodeURI(
        `submit?selftext=true&text=\n\n\n---\n\nVersion: ${
          browser.runtime.getManifest().version
        }\nBrowser: ${userBrowser.name[0].toUpperCase()}${userBrowser.name.slice(
          1,
        )} (${userBrowser.version})`,
      )}
    />
    <ListItemLink primary="Ask on Reddit" subreddit="submit?selftext=true" />
    <ListItemLink primary="Tweet Us" twitter="repeekgg" />
  </React.Fragment>
)
