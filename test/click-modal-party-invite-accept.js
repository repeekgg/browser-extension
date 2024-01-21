import test from 'ava'
import { parseHTML } from 'linkedom'
import sinon from 'sinon'
import clickModalPartyInviteAccept, {
  FEATURE_NAME,
} from '../src/content/features/click-modal-party-invite-accept'
import { hasFeatureAttribute } from '../src/content/helpers/dom-element'

const faceitEnvs = [
  {
    name: 'faceit',
    html: '<div class="ReactModalPortal"><div class="ReactModal__Overlay ReactModal__Overlay--after-open" style="position: fixed; inset: 0px; background-color: rgba(0, 0, 0, 0.6); justify-content: center; align-items: flex-start; display: flex; overflow: auto; z-index: 1060;"><div class="ReactModal__Content ReactModal__Content--after-open" tabindex="-1" role="dialog" aria-modal="true" style="position: static; inset: inherit; border: none; background: none; overflow: visible; border-radius: inherit; outline: none; padding: 0px;"><div class="sc-jGONNV eeOWko"><div class="sc-dEMAZk eRZiMf"><h5 size="5" class="sc-dIHSXr eCRPLL sc-lopPiv dTBdcK">Invite to <span class="sc-imJffE hLozcV">party</span></h5><div class="sc-iugpza Txjh"><button class="sc-bypJrT djmUHF sc-ddjGPC gQPuSg"><i class="sc-iHbSHJ jkbxap"><svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" color="white" height="16" width="16" class="sc-klVQfs gdbspr"><path d="M8 7.025L4.939 3.994 7.969.936 7.025 0l-3.03 3.06L.937.03 0 .967l3.062 3.035L.03 7.063.967 8l3.037-3.064 3.06 3.033z" fill="currentColor"></path></svg></i></button></div></div><div class="sc-gMFoeA echMrx"><div class="sc-DwsMf gDFJfT"><div class="sc-dXHaLi iAwINc sc-cwsewg fZDMEu" size="80"><img aria-label="avatar" async="" src="https://distribution.faceit-cdn.net/images/657b4f34-9aa7-40a2-a9e4-c6a55d2e37ee.jpeg" class="sc-fRLnnz jeta-dZ"></div><div class="sc-ebpHGS BJPam"><span class="sc-cbPlza fwYLNG">DACHEC_Bot invited you to join their party</span><span class="sc-cbPlza bctuZo">Click accept to join the party</span><span class="sc-cbPlza bctuZo">Time remaining: 11</span></div></div><div class="sc-jaZhys dcznqn"><div class="sc-eOPQkR kCAsay"><button class="sc-bypJrT djmUHF sc-ddjGPC iXRFJh">Decline</button><button class="sc-bypJrT djmUHF sc-ddjGPC dzWORN">Accept</button></div></div></div></div></div></div></div>',
  },
  {
    name: 'faceit-beta',
    html: '<div class="ReactModalPortal"><div class="ReactModal__Overlay ReactModal__Overlay--after-open" style="position: fixed; inset: 0px; background-color: rgba(0, 0, 0, 0.6); justify-content: center; align-items: flex-start; display: flex; overflow: auto; z-index: 1060;"><div class="ReactModal__Content ReactModal__Content--after-open" tabindex="-1" role="dialog" aria-modal="true" style="position: static; inset: inherit; border: none; background: none; overflow: visible; border-radius: inherit; outline: none; padding: 0px;"><div class="modal-next__Container-sc-b6f0d17-0 ZrgS"><div class="Header__HeaderHolder-sc-2cc7dc89-0 buHuYI"><h5 size="5" class="HeadingBase-sc-e48327c2-0 bNWKuw Header__HeaderText-sc-2cc7dc89-1 jPWORZ">Invite to <span class="style__PrimaryText-sc-918d2fcb-4 djldSF">party</span></h5><div class="Header__CloseButtonContainer-sc-2cc7dc89-2 erCApM"><button class="ButtonBase__Wrapper-sc-9fae6077-0 bwdpsX Button__Base-sc-bcb6f5c8-0 gnShNk"><i class="Icon__Holder-sc-cac5ab18-0 CUA-DS"><svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" color="white" height="16" width="16" class="Icon__StyledISvg-sc-cac5ab18-1 etGOee"><path d="M8 7.025L4.939 3.994 7.969.936 7.025 0l-3.03 3.06L.937.03 0 .967l3.062 3.035L.03 7.063.967 8l3.037-3.064 3.06 3.033z" fill="currentColor"></path></svg></i></button></div></div><div class="modal-next__Body-sc-b6f0d17-1 bOphMK"><div class="style__Holder-sc-918d2fcb-1 hEeDFz"><div class="Avatar__AvatarHolder-sc-89ce63d3-1 ejzlkk style__Avatar-sc-918d2fcb-0 hprtIr" size="80"><img aria-label="avatar" async="" src="https://distribution.faceit-cdn.net/images/657b4f34-9aa7-40a2-a9e4-c6a55d2e37ee.jpeg" class="Avatar__Image-sc-89ce63d3-2 hNxHpG"></div><div class="style__TextHolder-sc-918d2fcb-2 liNDFA"><span class="Text-sc-f75cefb7-0 kcmOTI">DACHEC_Bot invited you to join their party</span><span class="Text-sc-f75cefb7-0 gjVnMO">Click accept to join the party</span><span class="Text-sc-f75cefb7-0 gjVnMO">Time remaining: 7</span></div></div><div class="modal-next__Footer-sc-b6f0d17-2 fwatWi"><div class="style__ActionsHolder-sc-918d2fcb-3 laOydE"><button class="ButtonBase__Wrapper-sc-9fae6077-0 bwdpsX Button__Base-sc-bcb6f5c8-0 hgGeBh">Decline</button><button class="ButtonBase__Wrapper-sc-9fae6077-0 bwdpsX Button__Base-sc-bcb6f5c8-0 gWLpuZ">Accept</button></div></div></div></div></div></div></div>',
  },
]

for (const faceitEnv of faceitEnvs) {
  test(`${faceitEnv.name} - sets feature attribute`, async (t) => {
    const { document } = parseHTML(faceitEnv.html)

    await clickModalPartyInviteAccept({
      isFaceitBeta: faceitEnv.name === faceitEnvs[1].name,
      baseElement: document,
    })

    t.true(
      hasFeatureAttribute(
        FEATURE_NAME,
        document.querySelector('.ReactModalPortal'),
      ),
    )
  })

  test(`${faceitEnv.name} - clicks accept button`, async (t) => {
    const { document } = parseHTML(faceitEnv.html)

    const acceptButton = document.querySelectorAll('button')[2]

    acceptButton.onclick = sinon.spy()

    await clickModalPartyInviteAccept({
      isFaceitBeta: faceitEnv.name === faceitEnvs[1].name,
      baseElement: document,
    })

    t.true(acceptButton.onclick.calledOnce)
  })
}
