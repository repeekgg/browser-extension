import test from 'ava'
import sinon from 'sinon'
import * as utils from '../src/content/libs/utils'

test('runFeatureIf', async t => {
  const store = {
    get: () => ({ testTrue: true, testFalse: false })
  }
  const feature = sinon.spy()
  const parent = 'test'

  await utils.runFeatureIf('testTrue', feature, parent, store)

  t.true(feature.calledOnce)
  t.true(feature.calledWith(parent))

  await utils.runFeatureIf('testFalse', feature, parent, store)

  t.true(feature.calledOnce)
})
