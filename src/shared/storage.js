import OptionsSync from 'webext-options-sync'
import { DEFAULTS } from './settings'

const storage = new OptionsSync({
  defaults: DEFAULTS,
  migrations: [
    savedOptions => {
      if (
        savedOptions.matchRoomAutoVetoMapItems &&
        savedOptions.matchRoomAutoVetoMapItems.includes('de_cache')
      ) {
        savedOptions.matchRoomAutoVetoMapItems = savedOptions.matchRoomAutoVetoMapItems.filter(
          map => map !== 'de_cache'
        )
        savedOptions.matchRoomAutoVetoMapItems.push('de_ancient')
      }
    },
    OptionsSync.migrations.removeUnused
  ]
})

export default storage
