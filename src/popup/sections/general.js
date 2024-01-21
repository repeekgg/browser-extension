import React, { useState, useEffect } from 'react'
import {
  getHasFaceitBetaHostPermission,
  requestFaceitBetaHostPermission,
} from '../../shared/faceit-beta'
import storage from '../../shared/storage'
import ListItemLink from '../components/list-item-link'
import ListItemSwitch from '../components/list-item-switch'
import ListSubheader from '../components/list-subheader'

export const GENERAL = 'General'

export default ({ getSwitchProps }) => {
  const [hasFaceitBetaHostPermission, setHasFaceitBetaHostPermission] =
    useState()
  const [extensionEnabledFaceitBeta, setExtensionEnabledFaceitBeta] = useState()

  useEffect(() => {
    ;(async () => {
      setHasFaceitBetaHostPermission(await getHasFaceitBetaHostPermission())

      setExtensionEnabledFaceitBeta(
        (await storage.getAll()).extensionEnabledFaceitBeta,
      )
    })()
  }, [])

  return (
    <React.Fragment>
      <ListSubheader>Extension</ListSubheader>
      <ListItemSwitch
        primary="Enabled"
        secondary="FACEIT will be enhanced."
        {...getSwitchProps('extensionEnabled')}
      />
      {typeof hasFaceitBetaHostPermission === 'boolean' &&
        typeof extensionEnabledFaceitBeta === 'boolean' && (
          <ListItemSwitch
            primary="Enabled on FACEIT Beta"
            secondary="FACEIT Beta (beta.faceit.com) will be enhanced. Please note that the FACEIT Beta is considered unstable, so Repeek will be as well. If you experience any issues with Repeek, please report them on Reddit or Twitter."
            onClick={async () => {
              if (!hasFaceitBetaHostPermission) {
                await requestFaceitBetaHostPermission()

                return
              }

              storage.set({
                extensionEnabledFaceitBeta: !extensionEnabledFaceitBeta,
              })

              setExtensionEnabledFaceitBeta(!extensionEnabledFaceitBeta)
            }}
            checked={hasFaceitBetaHostPermission && extensionEnabledFaceitBeta}
          />
        )}
      <ListItemLink
        primary="FACEIT Beta FAQ"
        secondary="Read more about the FACEIT Beta and how to opt-in/out of it."
        href="https://support.faceit.com/hc/en-us/articles/11287180980124-Public-BETA-FAQs"
      />
    </React.Fragment>
  )
}
