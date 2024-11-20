import test from 'ava'
import { parseHTML } from 'linkedom'
import sinon from 'sinon'
import { hasFeatureAttribute } from '../helpers/dom-element'
import clickModalMatchReady, { FEATURE_NAME } from './click-modal-match-ready'

const html = `<div role="dialog" id="radix-:ru:" aria-describedby="radix-:r10:" aria-labelledby="radix-:rv:" data-state="open"
  class="Content__StyledContentElement-sc-8e714027-0 gcTpz Content__StyledContent-sc-cffbcb94-0 eUlmsN" tabindex="-1"
  style="pointer-events: auto;">
  <div class="style__Container-sc-f57d8ccd-0 fkMwmp style__StandardStyledContainer-sc-26e550ba-0 bLJcTI">
    <div class="style__TitleContainer-sc-26e550ba-2 irDKuK">
      <div class="style__TitleWrapper-sc-26e550ba-3 dutTAK">
        <h5 size="5" class="HeadingBase-sc-63d0bc6b-0 kCnezd">Match ready</h5>
      </div>
    </div><button type="button"
      class="ButtonBase__Wrapper-sc-9fae6077-0 bwdpsX Button__Base-sc-1203e5b2-0 fftEKO IconButton__IconButtonOverride-sc-798372ab-0 kmYCGV style__StandardStyledClose-sc-26e550ba-7 cHNGA-D"
      aria-label="close"><i class="Icon__Holder-sc-f69a6bd-0 eEgeIo"><svg viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg" height="24" width="24" focusable="false" aria-hidden="true"
          class="Icon__StyledISvg-sc-f69a6bd-1 dbnjfB">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
            fill="currentColor"></path>
        </svg></i></button>
  </div>
  <div
    class="ScrollableContainer-sc-d3b2175f-0 style__Container-sc-6e38a6d0-0 kesfEf flbCZP styles__ModalContent-sc-442449b9-0 czkJa-D">
    <div class="styles__Row-sc-442449b9-3 iMbMl"><span class="Text-sc-67635c04-0 lcfixl"><span
          class="Text-sc-67635c04-0 getdDT">Confirm your match</span> <br> for the <span
          class="Text-sc-67635c04-0 styles__TextPrimary-sc-442449b9-2 getdDT jxwxil">Repeek</span></span></div>
    <div class="styles__Row-sc-442449b9-3 iMbMl"><span class="Text-sc-67635c04-0 dzSXae">Expires in:</span></div>
    <div class="CircleCountdown__CircleSpinner-sc-ee0e2f3c-0 htoyYT">
      <div class="CircleCountdown__CircleValue-sc-ee0e2f3c-2 gzhSUm"><span
          class="Text-sc-67635c04-0 CircleCountdown__StyledText-sc-ee0e2f3c-3 getdDT ikihcl">50</span></div>
      <div class="CircleCountdown__CircleOuter-sc-ee0e2f3c-1 ctHUOm"></div>
    </div>
  </div>
  <div class="style__Container-sc-10839366-0 ioUmRz style__ConfirmationStyledContainer-sc-1cb3a69f-0 fjLYOF"><button
      class="ButtonBase__Wrapper-sc-9fae6077-0 bwdpsX Button__Base-sc-1203e5b2-0 bUvTBc">Accept</button></div>
</div>`

test('sets feature attribute', async (t) => {
  const { document } = parseHTML(html)

  await clickModalMatchReady({ baseElement: document })

  t.true(
    hasFeatureAttribute(
      FEATURE_NAME,
      document.querySelector('div[role="dialog"]'),
    ),
  )
})

test('clicks accept button', async (t) => {
  const { document } = parseHTML(html)

  const acceptButton = document.querySelector(
    'div[class*="ConfirmationStyledContainer"] button',
  )

  acceptButton.onclick = sinon.spy()

  await clickModalMatchReady({ baseElement: document })

  t.true(acceptButton.onclick.calledOnce)
})
