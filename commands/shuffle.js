const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Ativa a ordem aleatória para tocar as músicas."),

    run: async ( { client, interaction } ) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há musicas na fila.")

        queue.shuffle();
        await interaction.editReply(`A fila de ${queue.tracks.length} músicas foram postas em ordem aleatória.`)
    },
}