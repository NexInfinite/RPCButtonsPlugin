/**
 * @name RPCButtons
 * @author Nexin
 * @authorId 737259502646198354
 * @version 0.0.1
 * @description Take controll of your rpc!
 * @invite gepaTQbWPV
 * @donate https://www.paypal.me/julianjones663
 * @website https://julians.work/
 * @source https://github.com/NexInfinite/RPCButtonsPlugin/blob/main/RPCButtons.plugin.js
 * @updateUrl https://github.com/NexInfinite/RPCButtonsPlugin/blob/main/RPCButtons.plugin.js
 */

module.exports = (() => {
  RPC = require("discord-rpc");
  const client = new RPC.Client({ transport: "ipc" });
  const config = {
    info: {
      name: "RPCButtons",
      authors: [
        {
          name: "Nexin",
          discord_id: "737259502646198354",
          github_username: "nexinfinite",
          twitter_username: "nexinwah",
        },
      ],
      version: "0.0.1",
      description: "Take control of your rpc! \n If you get an error saying `Connection closed`, you have restarted the rpc too many times and will have to wait for discords cooldowns.",
    },
    changelog: [
      {
        title: "The beginning",
        items: ["The start of the plugin!"],
      },
    ],
    defaultConfig: [
      {
        type: "switch",
        id: "isOn",
        name: "How to use",
        note:
          "Change the settings below and then reload the plugin by exiting out of this menu and turning the plugin off and then on again. If the rpc does not work try restart discord by fully closing it down and then launching it back up.",
        value: true,
      },
      {
        type: "textbox",
        id: "appid",
        name: "Application ID",
        note: "Go to https://discord.com/developers/ and create an application, this will be the title of your rpc. Then go to \"Rich Presence\" and add an image called \"made-by-nexin\", this will be the icon of your rpc. The last step is to go to \"General Information\" and copy the client ID and paste it in the box above.",
        value: "",
        placeholder: "Your Application ID",
      },
      {
        type: "textbox",
        id: "desc",
        name: "Description",
        note: "This is the description of your RPC",
        value: "I am the description",
        placeholder: "",
      },
      {
        type: "textbox",
        id: "state",
        name: "State",
        note: "This is the line under your description.",
        value: "I am the state",
        placeholder: "",
      },
      {
        type: "category",
        id: "button1",
        name: "Button 1 settings",
        collapsible: true,
        shown: false,
        settings: [
          {
            type: "textbox",
            id: "button1text",
            name: "Text",
            note: "This is what will be displayed on button 1",
            value: "Not a rick roll!",
            placeholder: "",
          },
          {
            type: "textbox",
            id: "button1url",
            name: "Url",
            note: "This is what you will be sent to on clicking the button. Please note that at the time of creating this plugin, users can't click their own buttons.",
            value: "https://www.youtube.com/watch?v=DLzxrzFCyOs",
            placeholder: "",
          },
        ],
      },
      {
        type: "category",
        id: "button2",
        name: "Button 2 settings",
        collapsible: true,
        shown: false,
        settings: [
          {
            type: "textbox",
            id: "button2text",
            name: "Text",
            note: "This is what will be displayed on button 1",
            value: "Not a rick roll!",
            placeholder: "",
          },
          {
            type: "textbox",
            id: "button2url",
            name: "Url",
            note: "This is what you will be sent to on clicking the button. Please note that at the time of creating this plugin, users can't click their own buttons.",
            value: "https://www.youtube.com/watch?v=DLzxrzFCyOs",
            placeholder: "",
          },
        ],
      },
    ],
    main: "index.js",
  };

  return !global.ZeresPluginLibrary
    ? class {
        constructor() {
          this._config = config;
        }
        getName() {
          return config.info.name;
        }
        getAuthor() {
          return config.info.authors.map((a) => a.name).join(", ");
        }
        getDescription() {
          return config.info.description;
        }
        getVersion() {
          return config.info.version;
        }
        load() {
          BdApi.showConfirmationModal(
            "Library Missing",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`,
            {
              confirmText: "Download Now",
              cancelText: "Cancel",
              onConfirm: () => {
                require("request").get(
                  "https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js",
                  async (error, response, body) => {
                    if (error)
                      return require("electron").shell.openExternal(
                        "https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js"
                      );
                    await new Promise((r) =>
                      require("fs").writeFile(
                        require("path").join(
                          BdApi.Plugins.folder,
                          "0PluginLibrary.plugin.js"
                        ),
                        body,
                        r
                      )
                    );
                  }
                );
              },
            }
          );
        }
        start() {}
        stop() {}
      }
    : (([Plugin, Api]) => {
        const plugin = (Plugin, Api) => {
          const {
            Patcher,
            WebpackModules,
            DiscordModules,
            PluginUtilities,
            Utilities,
          } = Api;

          const SelectedChannelStore = DiscordModules.SelectedChannelStore;
          const ChannelStore = DiscordModules.ChannelStore;
          const ReactDOM = DiscordModules.ReactDOM;
          const InlineMediaWrapper = WebpackModules.getByProps(
            "ImageReadyStates"
          ).default;

          return class RPCButtons extends Plugin {
            constructor() {
              super();
            }

            onStart() {
              client.on("ready", () => {
                client.request("SET_ACTIVITY", {
                  pid: process.pid,
                  activity: {
                    assets: {
                      large_image: "made-by-nexin",
                    },
                    details: `${this.settings.desc}`,
                    state: `${this.settings.state}`,
                    buttons: [
                      {
                        label: `${this.settings.button1.button1text}`,
                        url: `${this.settings.button1.button1url}`,
                      },
                      {
                        label: `${this.settings.button2.button2text}`,
                        url: `${this.settings.button2.button2url}`,
                      },
                    ],
                  },
                });
              });

              client.login({ clientId: `${this.settings.appid}` }).catch((err) => {
                BdApi.alert(
                  "RPC Buttons Error!",
                  `The rpc could not start. Error: \`${err}\``
                );
              });
            }

            onStop() {
              Patcher.unpatchAll();
            }

            updateSettings(group, id, value) {
              if (group == "isOn") {
                if (id == true) {
                  // BdApi.alert("debug", this.settings.button1.button1text)
                  // this.reload_rpc();
                }
              }
            }

            getSettingsPanel() {
              const panel = this.buildSettingsPanel();
              panel.addListener(this.updateSettings.bind(this));
              return panel.getElement();
            }
          };
        };
        return plugin(Plugin, Api);
      })(global.ZeresPluginLibrary.buildPlugin(config));
})();
