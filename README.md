# FACEIT Enhancer

> Browser extension that enhances the FACEIT experience and adds useful features

# Development

Clone repository and install npm dependencies:
```
yarn install
```

Build the extension into a `dist` folder, listen for file changes and automatically rebuild:
```
yarn dev
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
