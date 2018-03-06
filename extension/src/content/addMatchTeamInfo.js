import { getPlayer } from './lib/faceit'
import { select } from './utils'

export default function addMatchTeamInfo() {
  const teams = Array.from(document.getElementsByTagName('match-team'))

  const team1Elos = []
  const team2Elos = []

  teams.forEach(async team => {
    if (team.hasAttribute('faceit-enhancer')) {
      return
    }

    team.setAttribute('faceit-enhancer', 'true')

    const elos = []

    const teamMembers = Array.from(team.querySelectorAll('div.match-team-member__details__name'))

    await Promise.all(await teamMembers.map(async member => {
      const nicknameEl = member.querySelector('strong[ng-bind="::teamMember.nickname"]')
      const { innerHTML: nickname } = nicknameEl

      const player = await getPlayer(nickname)

      const playerCountry = player.country.toUpperCase()
      const flag = document.createElement('img')
      flag.classList.add('flag--14')
      flag.setAttribute('src', `https://cdn.faceit.com/frontend/561/assets/images/flags/${playerCountry}.png`)
      member.prepend(flag)

      const playerElo = player.games.csgo.faceit_elo
      const elo = document.createElement('span')
      elo.classList.add('text-muted', 'ellipsis-b')
      elo.innerHTML = `ELO: ${playerElo || '–'}`
      member.append(elo)
      if (playerElo) {
        elos.push(playerElo)
      }
    }))

    const faction = team.getAttribute('members')

    const teamNameEl = select(`h2[ng-bind="${faction}_nickname"]`)

    const totalElo = elos.reduce((acc, curr) => acc + curr, 0)
    const teamEloEl = document.createElement('span')
    teamEloEl.classList.add('text-muted')
    teamEloEl.setAttribute('style', 'display: block; margin-top: 6px; font-size: 14px;')
    teamEloEl.innerHTML = `Avg. ELO: ${Math.round(totalElo / 5)}<br />Total ELO: ${totalElo}`

    teamNameEl.append(teamEloEl)
  })
}
