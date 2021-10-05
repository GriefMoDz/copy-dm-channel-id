const { Plugin } = require('powercord/entities');
const { React, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { findInReactTree } = require('powercord/util');
const { Menu } = require('powercord/components');

const { clipboard } = require('electron');

module.exports = class CopyDMChannelID extends Plugin {
  get currentUserId () {
    return window.DiscordNative.crashReporter.getMetadata().user_id;
  }

  async startPlugin () {
    const { getDMFromUserId } = await getModule([ 'getDMFromUserId' ]);
    const useCopyDmChannelIdItem = (channelId) => React.createElement(Menu.MenuItem, {
      id: 'copy-dm-channel-id',
      label: 'Copy DM Channel ID',
      action: () => clipboard.writeText(channelId)
    });

    const DMUserContextMenu = await getModule(m => m.default && m.default.displayName === 'DMUserContextMenu');
    inject('copy-dm-channel-id-isolated', DMUserContextMenu, 'default', (args, res) => {
      if (args[0].user.id === this.currentUserId) {
        return res;
      }

      const developerGroup = findInReactTree(res, n => n.props && n.props.children && n.props.children.key === 'devmode-copy-id');
      if (developerGroup && this.settings.get('isolated', false)) {
        if (!Array.isArray(developerGroup)) {
          developerGroup.props.children = [ developerGroup.props.children ];
        }

        developerGroup.props.children.push(useCopyDmChannelIdItem(args[0].channel.id));
      }

      return res;
    });

    DMUserContextMenu.default.displayName = 'DMUserContextMenu';

    const CopyIDItem = await getModule(m => m.default && m.default.displayName === 'useCopyIdItem');
    inject('copy-dm-channel-id-global', CopyIDItem, 'default', ([ userId ], res) => {
      if (userId === this.currentUserId) {
        return res;
      }

      const channelId = getDMFromUserId(userId);
      if (channelId && !this.settings.get('isolated', false)) {
        return [ res, useCopyDmChannelIdItem(channelId) ];
      }

      return res;
    });

    CopyIDItem.default.displayName = 'useCopyIdItem';
  }

  pluginWillUnload () {
    uninject('copy-dm-channel-id-isolated');
    uninject('copy-dm-channel-id-global');
  }

  setIsolated (state) {
    this.settings.set('isolated', state);

    return this.log(`Copy DM Channel ID ${state ? 'has now been' : 'is no longer'} isolated to the DM User Context Menu!`);
  }
};
