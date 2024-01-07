const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pausa a música atual."),

    run: async ( { client, interaction } ) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há musicas na fila.")

        queue.setPaused(true);
        await interaction.editReply("A música foi pausada. Digite `/resume` para retomar o som.")
    },
}