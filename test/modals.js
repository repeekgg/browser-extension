/** @jsx h */
import test from 'ava'
import { h } from 'dom-chef'
import * as modals from '../src/content/helpers/modals'

test('isInviteToParty', t => {
  t.true(
    modals.isInviteToParty(
      <div>
        <h3 translate-once="INVITE-TO-PARTY" />
      </div>
    )
  )

  t.false(modals.isInviteToParty(<div />))
})

test('isMatchQueuing', t => {
  t.true(
    modals.isMatchQueuing(
      <div>
        <h3 translate-once="QUICK-MATCH-QUEUING" />
      </div>
    )
  )

  t.false(modals.isMatchQueuing(<div />))
})

test('isMatchReady', t => {
  t.true(
    modals.isMatchReady(
      <div>
        <h3 translate-once="MATCH-READY" />
      </div>
    )
  )

  t.false(modals.isMatchReady(<div />))
})
