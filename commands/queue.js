const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } =  require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("fila")
    .setDescription("Mostra a fila atual.")
    .addNumberOption((option) => option.setName("página").setDescription("Número da página").setMinValue(1)),

    run: async ({ client, interaction }) => {
        const queue = client.player.getQueue(interaction.guildId)
        if (!queue || !queue.playing) {
            return await interaction.editReply("Não há musicas na fila.")
        }

        const totalPages = Math.ceil(queue.tracks.length/10) || 1
        const page = (interaction.options.getNumber("página") || 1)

        if (page < totalPages) 
            return await interaction.editReply(`Página inválida. Há somente ${totalPages} páginas.`)

        const queueString = queue.tracks.slice(page * 10, page * 10 + 10).map((song, i) => {
            return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
        })

        const currentSong = queue.current

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Tocando Agora**\n` + 
                    (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None") +
                    `\n\n**Fila**\n${queueString}`)
                    .setFooter({
                        text: `Página ${page + 1} de ${totalPages}`
                    })
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    }
}