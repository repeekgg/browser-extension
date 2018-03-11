/** @jsx h */
import test from 'ava'
import { h } from 'dom-chef'
import sinon from 'sinon'
import * as utils from '../src/content/libs/utils'

test('hasEnhancerAttribute', t => {
  t.true(utils.hasEnhancerAttribute(<div faceit-enhancer="true" />))
  t.false(utils.hasEnhancerAttribute(<div />))
})

test('setEnhancerAttribute', t => {
  const element = <div />

  utils.setEnhancerAttribute(element)

  t.true(element.hasAttribute('faceit-enhancer'))
})

test('runFeatureIf', async t => {
  const store = {
    get: value => value
  }
  const feature = sinon.spy()
  const parent = 'test'

  await utils.runFeatureIf(true, feature, parent, store)

  t.true(feature.calledOnce)
  t.true(feature.calledWith(parent))

  await utils.runFeatureIf(false, feature, parent, store)

  t.true(feature.calledOnce)
})
