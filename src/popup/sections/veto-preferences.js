import React from 'react'
import {
  MATCH_ROOM_VETO_LOCATION_REGIONS,
  MATCH_ROOM_VETO_MAP_ITEMS
} from '../../shared/settings'
import ListSubheader from '../components/list-subheader'
import ListItemMenu from '../components/list-item-menu'
import ListItemText from '../components/list-item-text'
import ListItemSwitch from '../components/list-item-switch'
import ListItemsSortable from '../components/list-items-sortable'

export const VETO_PREFERENCES = 'Veto Preferences'

export default ({ getMenuProps, getSortableProps, getSwitchProps }) => (
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
    <ListItemSwitch
      primary="Shuffle"
      secondary="Shuffle an amount of items from top to have some variety of maps to be played."
      {...getSwitchProps('matchRoomAutoVetoMapsShuffle')}
    />
    <ListItemMenu
      primary="Shuffle Amount"
      options={MATCH_ROOM_VETO_MAP_ITEMS.map((_, index) => index + 1)}
      mapOption={option => `First ${option}`}
      {...getMenuProps('matchRoomAutoVetoMapsShuffleAmount')}
    />
    <ListItemSwitch
      primary="Veto Limit"
      secondary="Limit the amount of maps gets auto vetoed."
      {...getSwitchProps('matchRoomAutoVetoMapsLimit')}
    />
    <ListItemMenu
      primary="Veto Limit Amount"
      options={[...Array(4).keys()].map((_, index) => index + 1)}
      mapOption={option => `First ${option}`}
      {...getMenuProps('matchRoomAutoVetoMapsLimitAmount')}
    />
    <ListItemText secondary="Sorted by favourite to least favourite. Least favourite will be vetoed first." />
    <ListItemsSortable {...getSortableProps('matchRoomAutoVetoMapItems')} />
  </React.Fragment>
)
