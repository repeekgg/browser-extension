import { getPlayer } from './lib/faceit'
import { select } from './utils'

export default function addMatchTeamInfo() {
  const teams = Array.from(document.getElementsByTagName('match-team'))

  const team1Elos = []
  const team2Elos = []

  teams.forEach(async team => {
    const faction = team.getAttribute('members')

    const elos = []

    const teamMembers = Array.from(team.querySelectorAll('div.match-team-member__details__name'))

    await Promise.all(await teamMembers.map(async member => {
      const nicknameEl = member.querySelector('strong[ng-bind="::teamMember.nickname"]')

      if (nicknameEl.hasAttribute('faceit-enhancer')) {
        return
      }

      nicknameEl.setAttribute('faceit-enhancer', 'true')

      const { innerHTML: nickname } = nicknameEl

      const player = await getPlayer(nickname)

      const playerCountry = player.country.toUpperCase()
      const flag = document.createElement('img')
      flag.classList.add('flag--14')
      flag.setAttribute('src', `https://cdn.faceit.com/frontend/561/assets/images/flags/${playerCountry}.png`)
      if (faction.includes('faction1')) {
        flag.setAttribute('style', 'margin-right: 6px')
        nicknameEl.prepend(flag)
      } else {
        flag.setAttribute('style', 'margin-left: 6px')
        nicknameEl.append(flag)
      }

      const playerElo = player.games.csgo.faceit_elo
      const elo = document.createElement('span')
      elo.classList.add('text-muted', 'ellipsis-b')
      elo.innerHTML = `ELO: ${playerElo || '–'}`
      member.append(elo)
      if (playerElo) {
        elos.push(playerElo)
      }
    }))

    if (elos.length) {
      const teamNameEl = select(`h2[ng-bind="${faction}_nickname"]`)

      if (teamNameEl.hasAttribute('faceit-enhancer')) {
        return
      }

      teamNameEl.setAttribute('faceit-enhancer', 'true')

      const totalElo = elos.reduce((acc, curr) => acc + curr, 0)
      const teamEloEl = document.createElement('span')
      teamEloEl.classList.add('text-muted')
      teamEloEl.setAttribute('style', 'display: block; margin-top: 6px; font-size: 14px;')
      teamEloEl.innerHTML = `Avg. ELO: ${Math.round(totalElo / 5)}<br />Total ELO: ${totalElo}`

      teamNameEl.append(teamEloEl)
    }
  })
}
