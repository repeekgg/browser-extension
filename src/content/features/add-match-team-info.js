/** @jsx h */
import { h } from 'dom-chef'
import stringToColor from 'string-to-color'
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

function addPlayerPartyColorElement(partyId, alignedLeft, target) {
  const color = stringToColor(partyId)

  target.setAttribute(
    'style',
    `border-${
      alignedLeft ? 'left' : 'right'
    }: 2px solid ${color}; border-radius: 0;`
  )
}

export default async target => {
  const matchId = getRoomId()
  const match = await getMatch(matchId)

  const teamsElements = Array.from(target.getElementsByTagName('match-team'))

  teamsElements.forEach(async teamElement => {
    const membersAttribute = teamElement.getAttribute('members')

    if (membersAttribute) {
      const faction = membersAttribute.split('match.')[1]

      const alignedLeft = teamElement.getAttribute('member-align') !== 'right'
      const teamELO = []

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

              const team = match[faction]
              const playerPartyId = team.find(
                teamMember => teamMember.guid === player.guid
              ).active_team_id
              addPlayerPartyColorElement(
                playerPartyId || nickname,
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
