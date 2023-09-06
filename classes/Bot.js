const { Client, GatewayIntentBits, Partials } = require('discord.js');

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
        // TODO: Command loading and registration.
    }
};