export const UPDATE_NOTIFICATION_TYPES = ['tab', 'badge', 'disabled']

export const MATCH_ROOM_VETO_LOCATION_ITEMS = {
  EU: ['UK', 'Sweden', 'France', 'Germany', 'Netherlands'],
  US: ['Chicago', 'Dallas', 'Denver'],
  Oceania: ['Sydney', 'Melbourne']
}

export const MATCH_ROOM_VETO_LOCATION_REGIONS = Object.keys(
  MATCH_ROOM_VETO_LOCATION_ITEMS
)

// I was not sure how to limit max veto picks to 4 in list-item-menu, so I added this to use it.
export const MAX_VETO_OPTIONS = [
  'MAP 1',
  'MAP 3',
  'MAP 5',
  'MAP 7'
]

export const MATCH_ROOM_VETO_MAP_ITEMS = [
  'de_dust2',
  'de_mirage',
  'de_overpass',
  'de_inferno',
  'de_nuke',
  'de_ancient',
  'de_train',
  'de_vertigo'
]

export const DEFAULTS = {
  extensionEnabled: true,
  headerShowElo: true,
  hideFaceitClientHasLandedBanner: true,
  playerProfileLevelProgress: true,
  partyAutoAcceptInvite: false,
  matchQueueAutoReady: false,
  matchRoomShowPlayerStats: false,
  matchRoomShowMapStats: false,
  matchRoomAutoCopyServerData: false,
  matchRoomAutoConnectToServer: false,
  matchRoomHidePlayerControls: true,
  matchRoomAutoVetoLocations: false,
  matchRoomAutoVetoLocationItems: MATCH_ROOM_VETO_LOCATION_ITEMS,
  matchRoomAutoVetoMaps: false,
  matchRoomAutoVetoMapsShuffle: false,
  matchRoomAutoVetoMapsShuffleAmount: 3,
  matchRoomAutoVetoMapsLimit: false,
  matchRoomAutoVetoMapsLimitAmount: 3,
  matchRoomAutoVetoMapItems: MATCH_ROOM_VETO_MAP_ITEMS,
  matchRoomFocusMode: false,
  modalCloseMatchVictory: false,
  modalCloseMatchDefeat: false,
  modalCloseGlobalRankingUpdate: false,
  modalClickInactiveCheck: false,
  notifyDisabled: false,
  notifyPartyAutoAcceptInvite: true,
  notifyMatchQueueAutoReady: true,
  notifyMatchRoomAutoCopyServerData: true,
  notifyMatchRoomAutoConnectToServer: true,
  notifyMatchRoomAutoVetoLocations: true,
  notifyMatchRoomAutoVetoMaps: true,
  updateNotificationType: 'tab',
  teamRosterPlayersInfo: true,
  updateNotifications: []
}
