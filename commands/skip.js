const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pular")
    .setDescription("Pula a música atual."),

    run: async ( { client, interaction } ) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há musicas na fila.")

        queue.skip();
    },
}