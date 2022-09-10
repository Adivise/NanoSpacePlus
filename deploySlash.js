const { plsParseArgs } = require('plsargs');
const args = plsParseArgs(process.argv.slice(2));
const path = require("path");
const { TOKEN } = require("./settings/config.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');

(async () => {

        let deployed = args.get(0) == "guild" ? "guild" : args.get(0) == "global" ? "global" : args.get(0) == "clear" ? "clear" : args.get(0) == "clearglobal" ? "clearglobal" : null;

        if (!deployed) {
            console.error(`Invalid sharing mode! Valid modes: guild, global, clear, clearglobal`);
            console.error(`Usage example: node deploySlash.js guild <guildId>`);
            console.error(`Usage example: node deploySlash.js global`);
            console.error(`Usage example: node deploySlash.js clear <guildId>`);
            console.error(`Usage example: node deploySlash.js clearglobal`);

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

        switch (deployed) {
            case "guild": {
                let guildId = args.get(1);
                console.info(`Sharing mode: guild (${guildId})`);

                await rest.put(Routes.applicationGuildCommands(client.id, guildId), { body: commands });

                console.info(`[Deploying] Slash commands may take 3-5 seconds to arrive.`);
                break;
            }
            case "global": {
                console.info(`Sharing mode: global`);

                await rest.put(Routes.applicationCommands(client.id), { body: commands });
    
                console.info(`[Deploying] Slash commands can take up to 1 hour to arrive. If you want it to come immediately, you can throw your bot from your server and get it back.`);
                break;
            }
            case "clear": {
                let guildId = args.get(1);
                console.info(`Sharing mode: clear (${guildId})`);

                await rest.put(Routes.applicationGuildCommands(client.id, guildId), { body: [] });

                console.info(`[Clearing] Slash commands may take 3-5 seconds to arrive.`);
                break;
            }
            case "clearglobal": {
                console.info(`Sharing mode: clear global`);

                await rest.put(Routes.applicationCommands(client.id), { body: [] });

                console.info(`[Clearing] Slash commands can take up to 1 hour to arrive. If you want it to come immediately, you can throw your bot from your server and get it back.`);
                break;
            }
        }

        console.info(`Slash (Application) deployed!`);
    })
();