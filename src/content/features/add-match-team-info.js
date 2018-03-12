/** @jsx h */
import { h } from 'dom-chef'
import select from 'select-dom'
import { getPlayer, getMatch } from '../libs/faceit'
import { getRoomId } from '../libs/pages'
import { hasEnhancerAttribute, setEnhancerAttribute } from '../libs/utils'

function addPlayerCountryFlagElement(country, alignedLeft, target) {
  const element = (
    <img
      src={`https://cdn.faceit.com/frontend/561/assets/images/flags/${country}.png`}
      className="flag--14"
      style={{
        [`margin-${alignedLeft ? 'right' : 'left'}`]: 6,
        'margin-bottom': 4
      }}
    />
  )

  target[alignedLeft ? 'prepend' : 'append'](element)
}

function addPlayerELOElement(elo, target) {
  const element = (
    <span className="text-muted ellipsis-b">ELO: {elo || '–'}</span>
  )

  target.append(element)
}

function addTeamELOElement(elo, target) {
  const totalElo = elo.reduce((acc, curr) => acc + curr, 0)
  const averageElo = Math.round(totalElo / 5)

  const element = (
    <span
      className="text-muted"
      style={{ display: 'block', 'margin-top': 6, 'font-size': 14 }}
    >
      Avg. ELO: {averageElo}
      <br />
      Total ELO: {totalElo}
    </span>
  )

  target.append(element)
}

function addPlayerPartyColorElement(color, alignedLeft, target) {
  target.setAttribute(
    'style',
    `border-${
      alignedLeft ? 'left' : 'right'
    }: 2px solid ${color}; border-radius: 0;`
  )
}

function mapPartiesToColors(team, alignedLeft) {
  const distinctColors = [
    '#BE0032',
    '#F3C300',
    '#875692',
    '#A1CAF1',
    '#C2B280',
    '#848482',
    '#008856',
    '#F38400',
    '#E68FAC',
    '#0067A5'
  ]

  const colors = team.reduce(
    (acc, curr) => {
      const color = alignedLeft ? distinctColors.shift() : distinctColors.pop()

      return curr.active_team_id && !acc.parties[curr.active_team_id]
        ? {
            ...acc,
            parties: {
              ...acc.parties,
              [curr.active_team_id]: color
            }
          }
        : {
            ...acc,
            solos: {
              ...acc.solos,
              [curr.guid]: color
            }
          }
    },
    { parties: {}, solos: {} }
  )

  return colors
}

export default async target => {
  const matchId = getRoomId()
  const match = await getMatch(matchId)

  const teamsElements = Array.from(target.getElementsByTagName('match-team'))

  teamsElements.forEach(async teamElement => {
    const membersAttribute = teamElement.getAttribute('members')

    if (membersAttribute) {
      const teamELO = []
      const alignedLeft = teamElement.getAttribute('member-align') !== 'right'
      const faction = membersAttribute.split('match.')[1]
      const team = match[faction]
      const partyColors = mapPartiesToColors(team, alignedLeft)

      const teamMembersElements = Array.from(
        teamElement.querySelectorAll('div.match-team-member__details__name')
      )

      await Promise.all(
        await teamMembersElements.map(async memberElement => {
          const nicknameElement = memberElement.querySelector(
            'strong[ng-bind="::teamMember.nickname"]'
          )

          if (!hasEnhancerAttribute(nicknameElement)) {
            setEnhancerAttribute(nicknameElement)

            const nickname = nicknameElement.innerHTML
            const player = await getPlayer(nickname)

            if (player) {
              const playerCountry = player.country.toUpperCase()
              addPlayerCountryFlagElement(
                playerCountry,
                alignedLeft,
                nicknameElement
              )

              const playerELO = player.games[match.game].faceit_elo
              addPlayerELOElement(playerELO, memberElement)
              if (playerELO) {
                teamELO.push(playerELO)
              }

              const partyId =
                team.find(member => member.guid === player.guid)
                  .active_team_id || player.guid
              const partyColor =
                partyColors.parties[partyId] || partyColors.solos[partyId]
              addPlayerPartyColorElement(
                partyColor,
                alignedLeft,
                memberElement.parentElement.parentElement
              )
            }
          }
        })
      )

      if (teamELO.length > 0) {
        const teamNameElement = select(
          `h2[ng-bind="match.${faction}_nickname"]`
        )

        if (!hasEnhancerAttribute(teamNameElement)) {
          setEnhancerAttribute(teamNameElement)
          addTeamELOElement(teamELO, teamNameElement)
        }
      }
    }
  })
}
