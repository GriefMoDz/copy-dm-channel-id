const { Plugin } = require('powercord/entities');
const { React, getModule, contextMenu } = require('powercord/webpack');
const { clipboard } = require('electron');

module.exports = class CopyDMChannelID extends Plugin {
  startPlugin () {
    this._patchDeveloperModeGroup();
  }

  pluginWillUnload () {
    this._unpatchDeveloperModeGroup();
  }

  async _patchDeveloperModeGroup () {
    const { getDMFromUserId } = await getModule([ 'getDMFromUserId' ]);
    const DeveloperModeGroup = await getModule(m => m.default && m.default.displayName === 'DeveloperModeGroup');

    DeveloperModeGroup.default = (originalMethod => (args) => {
      const res = originalMethod(args);
      const channelId = getDMFromUserId(args.id);
      const ButtonMenuItem = res.props.children.type;

      if (channelId) {
        res.props.children = [ res.props.children ];
        res.props.children.push(React.createElement(ButtonMenuItem, {
          label: 'Copy DM Channel ID',
          action: () => {
            contextMenu.closeContextMenu();
            clipboard.writeText(channelId);
          }
        }));
      }

      return res;
    })(DeveloperModeGroup.__default = DeveloperModeGroup.default);

    DeveloperModeGroup.default.displayName = 'DeveloperModeGroup';
  }

  async _unpatchDeveloperModeGroup () {
    const DeveloperModeGroup = await getModule(m => m.default && m.default.displayName === 'DeveloperModeGroup');

    DeveloperModeGroup.default = DeveloperModeGroup.__default;
    delete DeveloperModeGroup.__default;
  }
};
