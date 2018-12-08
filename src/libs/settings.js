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
  'de_train',
  'de_vertigo'
]

export const DEFAULTS = {
  extensionEnabled: true,
  headerShowElo: true,
  hideFaceitClientHasLandedBanner: true,
  lastRosterSelection: [],
  playerProfileLevelProgress: true,
  partyAutoAcceptInvite: false,
  matchQueueAutoReady: false,
  matchRoomShowPlayerStats: false,
  matchRoomShowPlayerDivisions: true,
  matchRoomAutoCopyServerData: false,
  matchRoomAutoConnectToServer: false,
  matchRoomHidePlayerControls: true,
  matchRoomAutoVetoLocations: false,
  matchRoomAutoVetoLocationItems: MATCH_ROOM_VETO_LOCATION_ITEMS,
  matchRoomAutoVetoMaps: false,
  matchRoomAutoVetoMapsShuffle: false,
  matchRoomAutoVetoMapsShuffleAmount: 3,
  matchRoomAutoVetoMapItems: MATCH_ROOM_VETO_MAP_ITEMS,
  modalCloseMatchVictory: false,
  modalCloseMatchDefeat: false,
  modalCloseGlobalRankingUpdate: false,
  notifyDisabled: false,
  notifyPartyAutoAcceptInvite: true,
  notifyMatchQueueAutoReady: true,
  notifyMatchRoomAutoCopyServerData: true,
  notifyMatchRoomAutoConnectToServer: true,
  notifyMatchRoomAutoVetoLocations: true,
  notifyMatchRoomAutoVetoMaps: true,
  updateNotificationType: 'tab',
  updateNotifications: [],
  bans: [],
  vips: []
}
