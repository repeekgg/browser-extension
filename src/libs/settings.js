export const UPDATE_NOTIFICATION_TYPES = ['tab', 'badge', 'disabled']

export const MATCH_ROOM_VETO_LOCATION_ITEMS = {
  EU: ['UK', 'Sweden', 'France', 'Germany', 'Netherlands'],
  US: ['Chicago', 'Dallas', 'Denver'],
  Oceania: ['Sydney', 'Melbourne']
}

export const MATCH_ROOM_VETO_LOCATION_REGIONS = Object.keys(
  MATCH_ROOM_VETO_LOCATION_ITEMS
)

export const MATCH_ROOM_VETO_MAP_ITEMS = [
  'de_dust2',
  'de_mirage',
  'de_overpass',
  'de_inferno',
  'de_nuke',
  'de_cache',
  'de_cbble',
  'de_train'
]

export const DEFAULTS = {
  extensionEnabled: true,
  headerShowElo: true,
  playerProfileLevelProgress: true,
  partyAutoAcceptInvite: false,
  matchQueueAutoReady: false,
  matchRoomShowPlayerStats: false,
  matchRoomAutoCopyServerData: false,
  matchRoomAutoConnectToServer: false,
  matchRoomHidePlayerControls: true,
  matchRoomAutoVetoLocations: false,
  matchRoomAutoVetoLocationItems: MATCH_ROOM_VETO_LOCATION_ITEMS,
  matchRoomAutoVetoMaps: false,
  matchRoomAutoVetoMapsShuffle: false,
  matchRoomAutoVetoMapsShuffleAmount: 3,
  matchRoomAutoVetoMapItems: MATCH_ROOM_VETO_MAP_ITEMS,
  notifyDisabled: false,
  notifyPartyAutoAcceptInvite: true,
  notifyMatchQueueAutoReady: true,
  notifyMatchRoomAutoCopyServerData: true,
  notifyMatchRoomAutoConnectToServer: true,
  notifyMatchRoomAutoVetoLocations: true,
  notifyMatchRoomAutoVetoMaps: true,
  updateNotificationType: 'tab',
  updateNotifications: []
}
