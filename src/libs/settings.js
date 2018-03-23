export const UPDATE_NOTIFICATION_TYPES = ['tab', 'badge', 'disabled']

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
  partyAutoAcceptInvite: false,
  matchQueueAutoReady: false,
  matchRoomShowPlayerStats: false,
  matchRoomAutoCopyServerData: false,
  matchRoomAutoConnectToServer: false,
  matchRoomAutoCloseBrowserOnConnectToServer: false,
  matchRoomHidePlayerControls: true,
  matchRoomAutoVetoMaps: false,
  matchRoomAutoVetoMapItems: MATCH_ROOM_VETO_MAP_ITEMS,
  notifyDisabled: false,
  notifyPartyAutoAcceptInvite: true,
  notifyMatchQueueAutoReady: true,
  notifyMatchRoomAutoCopyServerData: true,
  notifyMatchRoomAutoConnectToServer: true,
  notifyMatchRoomAutoVetoMaps: true,
  updateNotificationType: 'tab',
  updateNotifications: []
}
