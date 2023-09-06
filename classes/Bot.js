const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');

const fs = require('fs');
const path = require('path');

const commandFolders = fs.readdirSync('./commands');

module.exports = class Bot extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
            ],
            partials: [
                Partials.Message,
            ],
        });

        this.config = {};
        this.config.guild = process.env.GUILD;
        this.config.moderationChannel = process.env.MODERATION_CHANNEL;
        this.config.outputChannel = process.env.OUTPUT_CHANNEL;

        this.registerEvents();
        this.registerCommands();
    }

    registerEvents() {
        const getFiles = require('../utilities/get-files');

        getFiles('./events', 'js').then(files => {
            files.forEach(file => {
                const event = require(`../events/${file}`);
                console.log(`Event loaded: ${event.name}.`);

                if (event.once) {
                    this.once(event.name, (...args) => event.execute(...args));
                } else {
                    this.on(event.name, (...args) => event.execute(...args));
                }
            });
        });
    }

    registerCommands() {
        const getFiles = require('../utilities/get-files');

	this.commands = new Collection();
	const commandPath = path.join(__dirname, '../commands');
	const commandFolders = fs.readdirSync('./commands');

	for (const folder of commandFolders){
		const folderPath = path.join(commandPath,folder);
	 	getFiles(folderPath, 'js').then(files => {
        	    files.forEach(file => {
				const command = require(path.join(folderPath, file));
                        	if ('data' in command && 'execute' in command) {
	                               	this.commands.set(command.data.name, command);
                        	} else {
                                	console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                        	}
                	});
	           });
        	}
	this.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
        }

        try {
                await command.execute(interaction);
        } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
        }
});
	}
};
