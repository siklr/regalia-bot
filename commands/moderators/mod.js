const { SlashCommandBuilder } = require('discord.js');

const mod_list = ['1110796010822836294', '1110795183743836170'];


module.exports = {
        data: new SlashCommandBuilder()
                .setName('mod')
                .setDescription('is a mod-only command, but with butts'),
        async execute(interaction) {
                //Get Roles of Command User
                const member_roles = Array.from(interaction.member.roles.cache.keys());

                //Check User Roles to see if mod
                const mod_flag = false;
                for(mod_role in mod_list){
                        if(member_roles.includes(mod_role)){
                                mod_flag = true;
                        }
                }

                //If user is mod
                if(mod_role){
                        await interaction.reply('Mmmmm feesh');
                }
                else{
                        await interaction.reply('Insufficently Stinky to Use this Command');
                }
        },
};
