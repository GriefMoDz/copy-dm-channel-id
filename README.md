# Copy DM Channel ID
A Powercord plug-in that appends a new action button—\"Copy DM Channel ID\"—under the contextual developer mode group that copies the channel ID of a DM ("Direct Message") when pressed; useful for experimental purposes and/or plug-in development.

## Button Isolation
If you prefer to isolate the button to the "DM User Context Menu" you can type:
```js
powercord.pluginManager.get('copy-dm-channel-id').setIsolated(true);
```
under your DevTools console (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>I</kbd>). You can also reverse this by changing the value to `false` which will display it on any user context menu.
