export const SUPPORTED_GAMES = new Set(['csgo', 'cs2'])

export function isSupportedGame(game) {
  return SUPPORTED_GAMES.has(game)
}
