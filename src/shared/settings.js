export const UPDATE_NOTIFICATION_TYPES = ['tab', 'badge', 'disabled']

export const MATCH_ROOM_VETO_LOCATION_ITEMS = {
  EU: ['UK', 'Sweden', 'France', 'Germany', 'Netherlands'],
  US: ['Chicago', 'Dallas', 'Denver', 'LosAngeles', 'NewYork'],
  Oceania: ['Sydney', 'Melbourne']
}

export const MATCH_ROOM_VETO_LOCATION_REGIONS = Object.keys(
  MATCH_ROOM_VETO_LOCATION_ITEMS
)

export const MATCH_ROOM_VETO_MAP_ITEMS = [
  'de_ancient',
  'de_anubis',
  'de_dust2',
  'de_inferno',
  'de_mirage',
  'de_nuke',
  'de_overpass',
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
  matchRoomAutoCopyServerData: false,
  matchRoomAutoConnectToServer: false,
  matchRoomHidePlayerControls: true,
  matchRoomAutoVetoLocations: false,
  matchRoomAutoVetoLocationItems: MATCH_ROOM_VETO_LOCATION_ITEMS,
  matchRoomAutoVetoMaps: false,
  matchRoomAutoVetoMapsShuffle: false,
  matchRoomAutoVetoMapsShuffleAmount: 3,
  matchRoomAutoVetoMapItems: MATCH_ROOM_VETO_MAP_ITEMS,
  matchRoomFocusMode: false,
  matchRoomLastConnectToServer: '',
  matchRoomSkinOfTheMatch: true,
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
  updateNotifications: [],
  teamRosterPlayersInfo: true,
  repeekNotificationClosed: false
}
