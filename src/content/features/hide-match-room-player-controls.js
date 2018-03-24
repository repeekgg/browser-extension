import styleInject from 'style-inject'

export default () => {
  styleInject(`
    .match-team-member__controls {
      display: none;
    }

    .match-team-member:hover .match-team-member__controls,
    .match-team-member__controls:focus-within {
      display: flex;
    }
  `)
}
