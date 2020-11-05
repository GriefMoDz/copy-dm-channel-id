const { Plugin } = require('powercord/entities');
const { React, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { Menu } = require('powercord/components');
const { clipboard } = require('electron');

module.exports = class CopyDMChannelID extends Plugin {
  async startPlugin () {
    const { getDMFromUserId } = await getModule([ 'getDMFromUserId' ]);

    const CopyIDItem = await getModule(m => m.default && m.default.displayName === 'useCopyIdItem');
    inject('copy-dm-channel-id', CopyIDItem, 'default', (args, res) => {
      const channelId = getDMFromUserId(args[0]);
      if (channelId) {
        return [ res, React.createElement(Menu.MenuItem, {
          id: 'copy-dm-channel-id',
          label: 'Copy DM Channel ID',
          action: () => clipboard.writeText(channelId)
        }) ];
      }

      return res;
    });

    CopyIDItem.default.displayName = 'useCopyIdItem';
  }

  pluginWillUnload () {
    uninject('copy-dm-channel-id');
  }
};
