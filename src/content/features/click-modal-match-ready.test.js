import test from 'ava'
import { parseHTML } from 'linkedom'
import sinon from 'sinon'
import { hasFeatureAttribute } from '../helpers/dom-element'
import clickModalMatchReady, { FEATURE_NAME } from './click-modal-match-ready'

const faceitEnvs = [
  {
    name: 'faceit',
    html: '<div class="FuseModalPortal"><div class="sc-eCzpMH kKNAGI"><div class="sc-ebXIMv eyDWHV"><div class="sc-ixPHmS eCOPlJ"><h5 size="5" class="sc-la-DkbX kQkVBe sc-cjaebs ikNtqh">Match ready</h5><div class="sc-ixPHmS eCOPlJ"><div class="sc-kPpCZy bDlndE"><div class="sc-vDfoV iiQvhx"><span class="sc-blKGMR eJHuoz"><span class="sc-blKGMR jHAoJl">Confirm your match</span><br>for the<span class="sc-blKGMR sc-dJslwX jHAoJl ilwsuI">Repeek</span></span></div><div class="sc-vDfoV iiQvhx"><span class="sc-blKGMR iNaqs">Expires in:</span></div><div class="CircleCountdown__CircleSpinner-sc-r4xxuy-0 gAAWfG"><div class="CircleCountdown__CircleValue-sc-r4xxuy-2 hpeccx"><span class="sc-blKGMR CircleCountdown__StyledText-sc-r4xxuy-3 jHAoJl ixeNii">58</span></div><div class="CircleCountdown__CircleOuter-sc-r4xxuy-1 kAHaiS"></div></div></div></div></div><div class="sc-hGWFOF fWYfV"><div class="sc-NsUQg XngkH"><button class="sc-bypJrT djmUHF sc-ddjGPC NpiYB">Accept</button></div></div></div></div></div>',
  },
  {
    name: 'faceit-next',
    html: '<div class="FuseModalPortal"><div class="dDwlWp styles__Backdrop-sc-f26c4043-0"><div class="enfnUD styles__ModalWrapper-sc-f26c4043-5"><div class="kwGAng styles__ModalContent-sc-f26c4043-6"><h5 class="HeadingBase-sc-62ac0e39-0 cHIIp hjZbyb styles__ModalTitle-sc-f26c4043-1" size="5">Match ready</h5><div class="kwGAng styles__ModalContent-sc-f26c4043-6"><div class="MatchCheckInModal__Holder-sc-97bdffe6-0 hwbxhV"><div class="MatchCheckInModal__Row-sc-97bdffe6-1 cXxmrZ"><span class="Text-sc-f75cefb7-0 gjVnMO"><span class="Text-sc-f75cefb7-0 kcmOTI">Confirm your match</span><br>for the<span class="Text-sc-f75cefb7-0 kcmOTI MatchCheckInModal__TextPrimary-sc-97bdffe6-3 jhUMpG">Repeek</span></span></div><div class="MatchCheckInModal__Row-sc-97bdffe6-1 cXxmrZ"><span class="Text-sc-f75cefb7-0 fRfakl">Expires in:</span></div><div class="CircleCountdown__CircleSpinner-sc-fdab6df8-0 epBeYb"><div class="CircleCountdown__CircleValue-sc-fdab6df8-2 indqqy"><span class="Text-sc-f75cefb7-0 kcmOTI CircleCountdown__StyledText-sc-fdab6df8-3 kTMQcx">46</span></div><div class="CircleCountdown__CircleOuter-sc-fdab6df8-1 gvtNmS"></div></div></div></div></div><div class="dtRESh styles__ModalActions-sc-f26c4043-3"><div class="fhyimy styles__ModalMainActions-sc-f26c4043-4"><button class="ButtonBase__Wrapper-sc-9fae6077-0 Button__Base-sc-fa9a2084-0 RDbNJ bwdpsX">Accept</button></div></div></div></div></div>',
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
