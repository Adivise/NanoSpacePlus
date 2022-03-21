const { plsParseArgs } = require('plsargs');
const argv = plsParseArgs(process.argv.slice(2));
const path = require("path");
const { TOKEN } = require("./settings/config.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');

(async () => {
        let publishMode = argv.get(0) == "guild" ? "guild" : argv.get(0) == "global" ? "global" : null;

        if (!publishMode) {
            console.error(`Invalid sharing mode! Valid modes: guild, global`);
            console.error(`Usage example: node deploySlash.js guild <guildId>`);
            console.error(`Usage example: node deploySlash.js global`);
        return process.exit(1);
        }

        const commands = [];

        readdirSync("./commands/").map(async dir => {
            readdirSync(`./commands/${dir}`).map(async (cmd) => {
                commands.push(require(path.join(__dirname, `./commands/${dir}/${cmd}`)));
            })
        })

        const rest = new REST({ version: "9" }).setToken(TOKEN);

        console.info("Retrieving account information!");
        /** @type {import("discord-api-types/rest/v9/user").RESTGetAPIUserResult} */

        const client = await rest.get(Routes.user());
        console.info(`Account information received! ${client.username}#${client.discriminator} (${client.id})`);

        console.info(`Slash (Application) are deployed on discord!`);

    switch (publishMode) {
        case "guild": {
            let guildId = argv.get(1);
            console.info(`Sharing mode: server (${guildId})`);

            await rest.put(Routes.applicationGuildCommands(client.id, guildId), { body: commands });

            console.info(`Slash commands may take 3-5 seconds to arrive.`);
            break;
        }
        case "global": {
            console.info(`Sharing mode: global`);

            await rest.put(Routes.applicationCommands(client.id), { body: commands });

            console.info(`Slash commands can take up to 1 hour to arrive. If you want it to come immediately, you can throw your bot from your server and get it back.`);
            break;
        }
    }
        console.info(`Slash (Application) deployed!`);
})();