import test from 'ava'
import { parseHTML } from 'linkedom'
import sinon from 'sinon'
import { hasFeatureAttribute } from '../helpers/dom-element'
import clickModalMatchReady, { FEATURE_NAME } from './click-modal-match-ready'

const faceitEnvs = [
  {
    name: 'faceit',
    html: '<div class="FuseModalPortal"><div class="sc-bklklh NYiAz"><div class="sc-blFMiU fwcYfZ"><div class="sc-cdoIaK gaeZTF"><h5 size="5" class="sc-dIHSXr eCRPLL sc-fGdiLE lDkFc">Match ready</h5><div class="sc-cdoIaK gaeZTF"><div class="MatchCheckInModal__Holder-sc-yu96n5-0 daGuZS"><div class="MatchCheckInModal__Row-sc-yu96n5-1 dZVETa"><span class="sc-cbPlza bctuZo"><span class="sc-cbPlza fwYLNG">Confirm your match</span> <br> for the <span class="sc-cbPlza MatchCheckInModal__TextPrimary-sc-yu96n5-3 fwYLNG jOluuF">Repeek</span></span></div><div class="MatchCheckInModal__Row-sc-yu96n5-1 dZVETa"><span class="sc-cbPlza jxujzL">Expires in:</span></div><div class="CircleCountdown__CircleSpinner-sc-r4xxuy-0 gAAWfG"><div class="CircleCountdown__CircleValue-sc-r4xxuy-2 hpeccx"><span class="sc-cbPlza CircleCountdown__StyledText-sc-r4xxuy-3 fwYLNG ixeNii">81</span></div><div class="CircleCountdown__CircleOuter-sc-r4xxuy-1 kAHaiS"></div></div></div></div></div><div class="sc-cbelJu UPaKd"><div class="sc-ifjxht ixStst"><button class="sc-bypJrT djmUHF sc-ddjGPC dzWORN">Accept</button></div></div></div></div></div>',
  },
  {
    name: 'faceit-beta',
    html: '<div class="FuseModalPortal"><div class="styles__Backdrop-sc-664e1c0f-0 fngpeO"><div class="styles__ModalWrapper-sc-664e1c0f-5 dvvnKY"><div class="styles__ModalContent-sc-664e1c0f-6 bwnBtX"><h5 size="5" class="HeadingBase-sc-e48327c2-0 bNWKuw styles__ModalTitle-sc-664e1c0f-1 dvUFkO">Match ready</h5><div class="styles__ModalContent-sc-664e1c0f-6 bwnBtX"><div class="MatchCheckInModal__Holder-sc-dcfe9dbf-0 bmHfST"><div class="MatchCheckInModal__Row-sc-dcfe9dbf-1 kIAsaH"><span class="Text-sc-f75cefb7-0 gjVnMO"><span class="Text-sc-f75cefb7-0 kcmOTI">Confirm your match</span> <br> for the <span class="Text-sc-f75cefb7-0 MatchCheckInModal__TextPrimary-sc-dcfe9dbf-3 kcmOTI czsWFE">Repeek</span></span></div><div class="MatchCheckInModal__Row-sc-dcfe9dbf-1 kIAsaH"><span class="Text-sc-f75cefb7-0 fRfakl">Expires in:</span></div><div class="CircleCountdown__CircleSpinner-sc-fdab6df8-0 epBeYb"><div class="CircleCountdown__CircleValue-sc-fdab6df8-2 indqqy"><span class="Text-sc-f75cefb7-0 CircleCountdown__StyledText-sc-fdab6df8-3 kcmOTI kTMQcx">81</span></div><div class="CircleCountdown__CircleOuter-sc-fdab6df8-1 gvtNmS"></div></div></div></div></div><div class="styles__ModalActions-sc-664e1c0f-3 jvlAUO"><div class="styles__ModalMainActions-sc-664e1c0f-4 cnaJxg"><button class="ButtonBase__Wrapper-sc-9fae6077-0 bwdpsX Button__Base-sc-bcb6f5c8-0 gWLpuZ">Accept</button></div></div></div></div></div>',
  },
]

for (const faceitEnv of faceitEnvs) {
  test(`${faceitEnv.name} - sets feature attribute`, async (t) => {
    const { document } = parseHTML(faceitEnv.html)

    await clickModalMatchReady({ baseElement: document })

    t.true(
      hasFeatureAttribute(
        FEATURE_NAME,
        document.querySelector('.FuseModalPortal'),
      ),
    )
  })

  test(`${faceitEnv.name} - clicks accept button`, async (t) => {
    const { document } = parseHTML(faceitEnv.html)

    const acceptButton = document.querySelector('button')

    acceptButton.onclick = sinon.spy()

    await clickModalMatchReady({ baseElement: document })

    t.true(acceptButton.onclick.calledOnce)
  })
}
