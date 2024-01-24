import chrome from 'sinon-chrome'

global.location = new URL('https://www.faceit.com')

global.chrome = chrome

global.chrome.runtime.id = 'testid'
