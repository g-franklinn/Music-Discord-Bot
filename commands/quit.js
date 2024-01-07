const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("sair")
    .setDescription("Retira o bot do canal de voz."),

    run: async ( { client, interaction } ) => {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue) return await interaction.editReply("Não há musicas na fila.")

        queue.destroy();
    },
}