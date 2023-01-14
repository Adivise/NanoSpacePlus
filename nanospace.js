const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { Manager } = require("erela.js");
const { I18n } = require("@hammerhq/localization");

class MainClient extends Client {
	 constructor() {
        super({
            shards: "auto",
            allowedMentions: { parse: ["users", "roles"] },
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.MessageContent,
            ]
        });

    this.config = require("./settings/config.js");
    this.button = require("./settings/button.js");
    this.owner = this.config.OWNER_ID;
    this.dev = this.config.DEV_ID;
    this.color = this.config.EMBED_COLOR;
    this.i18n = new I18n(this.config.LANGUAGE);
    if(!this.token) this.token = this.config.TOKEN;

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

    const client = this;

    this.manager = new Manager({
		nodes: this.config.NODES,
		autoPlay: true,
		volumeDecrementer: 0.75,
		forceSearchLinkQueries: true,
		defaultSearchPlatform: client.config.DEFAULT_SEARCH,
		allowedLinksRegexes: Object.values(Manager.regex),
		send(id, payload) {
			const guild = client.guilds.cache.get(id);
			if (guild) guild.shard.send(payload);
		},
    });

    ["slash", "premiums"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadDatabase", "loadPlayer"].forEach(x => require(`./handlers/${x}`)(client));

	}
		connect() {
        return super.login(this.token);
    };
};

module.exports = MainClient;