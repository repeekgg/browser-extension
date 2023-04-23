# Repeek (formerly FACEIT Enhancer)

> Browser extension that enhances the FACEIT experience and adds useful features

Originally created to replace the FACEIT HELPER browser extension, that got broken after FACEIT updated their website and FACEIT HELPER wasn't maintained anymore, Repeek became a must-have browser extension with over 700.000 users and growing for FACEIT users.

The goal of Repeek is to make everyone's life easier with automatation and showing additional information that normally only 3rd party websites are exposing from the FACEIT API, but these websites are usually full of ads and other shady stuff to make a profit out of it.

After releasing Repeek, I got approached by FACEIT and was asked to join them. Ultimately this project landed me a job at FACEIT in June 2018, which wasn't my plan at all actually. I've left FACEIT in September 2021.

- [Initial Announcement](https://www.reddit.com/r/GlobalOffensive/comments/82eq8j/ive_developed_faceit_enhancer_to_enhance_the/) (2018-03-09)
- [First Update Post](https://www.reddit.com/r/GlobalOffensive/comments/83pdza/update_faceit_enhancer_now_shows_player_country/) (2018-03-12)
- [Follow Up Post](https://www.reddit.com/r/GlobalOffensive/comments/872nl8/ive_developed_faceit_enhancer_to_enhance_the/) (2018-03-25)
- [FACEIT Job Announcement](https://www.reddit.com/r/FACEITEnhancer/comments/8jvh8x/i_will_soon_work_at_faceit_thanks_to_you_guys/) (2018-08-05)
- [Leaving FACEIT Announcement](https://twitter.com/timche_/status/1437437603456897033) (2021-09-13)
- [FACEIT Enhancer becomes Repeek](https://repeek.gg/blog/faceit-enhancer-becomes-repeek) (2023-04-23)

# Install

- [Chrome](https://chrome.google.com/webstore/detail/repeek/mokknliiomknodkdmpcellamkopbdmao) <img valign="middle" src="https://img.shields.io/chrome-web-store/v/mokknliiomknodkdmpcellamkopbdmao?label=%20"> <img valign="middle" src="https://img.shields.io/chrome-web-store/users/mokknliiomknodkdmpcellamkopbdmao"> <img valign="middle" src="https://img.shields.io/chrome-web-store/rating/mokknliiomknodkdmpcellamkopbdmao">
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/repeek/) <img valign="middle" src="https://img.shields.io/amo/v/repeek?label=%20"> <img valign="middle" src="https://img.shields.io/amo/users/repeek"> <img valign="middle" src="https://img.shields.io/amo/rating/repeek">

The Chrome version also works in Opera (using [this](https://addons.opera.com/en/extensions/details/download-chrome-extension-9/)) and Edge.

# Highlights

- Ready up for matches automatically
- Accept party invites automatically
- See players Elo and country in match rooms
- See teams Elo in match rooms
- See how much Elo you'll win or loose
- See player statistics of the last 20 matches in match rooms
- See how much Elo you have won and lost in your match history
- and more!

All features are configurable to your personal preferences.

# Development

Prerequisites:

- Node.js: `>=18.14.2 <19`
- npm: `>=9.5.0 <10`

Clone repository and install npm dependencies:

```sh
npm install
```

Build the extension into a `dist` folder, listen for file changes and automatically rebuild:

```sh
npm run dev
```

Load into the browser:

<table>
  <tr>
    <th>Chrome</th>
    <th>Firefox</th>
  </tr>
  <tr>
    <td width="50%">
      <ol>
        <li>Open <code>chrome://extensions</code>.</li>
        <li>Check the <i>Developer mode</i> checkbox.</li>
        <li>Click on <i>Load unpacked extension</i>.</li>
        <li>Select the <code>dist</code> folder.</li>
      </ol>
    </td>
    <td width="50%">
      <ol>
        <li>Open <code>about:debugging#addons</code>.</li>
        <li>Click on <i>Load Temporary Add-on</i>.</li>
        <li>Select the <code>dist/manifest.json</code> file.</li>
      </ol>
    </td>
  </tr>
</table>

Build the extension into a `dist` folder for publishing:

```sh
npm run build
```

# Team

- [Tim Cheung](https://github.com/timche) (Creator & Developer, [@timche\_](https://twitter.com/timche_))

# Disclaimer

Repeek is developed independently, and is not officially endorsed by or affiliated with FACEIT.
