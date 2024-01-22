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
      <ListSubheader>FACEIT Beta</ListSubheader>
      {typeof hasFaceitBetaHostPermission === 'boolean' &&
        typeof extensionEnabledFaceitBeta === 'boolean' && (
          <ListItemSwitch
            primary="Enabled"
            secondary="FACEIT Beta (beta.faceit.com) will be enhanced. Please note that the FACEIT Beta may contain errors or inaccuracies and may not function as well as standard FACEIT (www.faceit.com). If you experience any issues with Repeek, please report them on Reddit or Twitter."
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
        secondary="Read more about the FACEIT Beta, how to opt-in/out of it and provide feedback or report any issues."
        href="https://support.faceit.com/hc/en-us/articles/11287180980124-Public-BETA-FAQs"
      />
    </React.Fragment>
  )
}
