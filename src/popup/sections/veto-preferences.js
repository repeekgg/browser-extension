import React from 'react'
import { MATCH_ROOM_VETO_LOCATION_REGIONS } from '../../libs/settings'
import ListSubheader from '../components/list-subheader'
import ListItemMenu from '../components/list-item-menu'
import ListItemText from '../components/list-item-text'
import ListItemsSortable from '../components/list-items-sortable'

export const VETO_PREFERENCES = 'Veto Preferences'

export default ({ getMenuProps, getSortableProps }) => (
  <React.Fragment>
    <ListSubheader>Server Location Preferences</ListSubheader>
    <ListItemMenu
      primary="Region"
      options={MATCH_ROOM_VETO_LOCATION_REGIONS}
      {...getMenuProps('matchRoomVetoLocationRegion')}
    />
    <ListItemText secondary="Sorted by favourite to least favourite. Least favourite will be vetoed first." />
    <ListItemsSortable
      {...getSortableProps(
        'matchRoomAutoVetoLocationItems',
        ({ matchRoomAutoVetoLocationItems, matchRoomVetoLocationRegion }) =>
          matchRoomAutoVetoLocationItems[matchRoomVetoLocationRegion],
        (newItems, options, changeOption) => {
          changeOption({
            ...options.matchRoomAutoVetoLocationItems,
            [options.matchRoomVetoLocationRegion]: newItems
          })
        }
      )}
    />
    <ListSubheader divider>Map Preferences</ListSubheader>
    <ListItemText secondary="Sorted by favourite to least favourite. Least favourite will be vetoed first." />
    <ListItemsSortable {...getSortableProps('matchRoomAutoVetoMapItems')} />
  </React.Fragment>
)
