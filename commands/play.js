const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } =  require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Tocar musica/playlist a partir de seu titulo ou url.")
        .addStringOption((option) => option.setName("input").setDescription("url da musica ou playlist:").setRequired(true)),

    run: async({ client, interaction }) => {
        if (!interaction.member.voice.channel)
            return interaction.editReply("Você precisa estar em um canal de voz para executar esse comando.")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed();

        const input = interaction.options.getString("input");
        let result;

        if (input.includes("http")) {
            if (input.includes("playlist")) {
                result = await client.player.search(input, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST,
                });

                if (result.tracks.length === 0) return interaction.editReply("Nenhum resultado.");

                const playlist = result.playlist;
                await queue.addTracks(result.tracks)
                embed
                    .setDescription(`**${result.tracks.length} musicas de [${playlist.title}](${playlist.url})** adicionadas à fila.`)
                    .setThumbnail(playlist.thumbnail)

            } else {

                result = await client.player.search(input, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
                });

                if (result.tracks.length === 0) return interaction.editReply("Nenhum resultado.");

                const song = result.tracks[0];
                await queue.addTracks(song)
                embed
                    .setDescription(`**[${playlist.title}](${playlist.url})** adicionada à fila.`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duração: ${song.duration}` });
            }

        } else {
            result = await client.player.search(input, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (result.tracks.length === 0) return interaction.editReply("Nenhum resultado.");

            const song = result.tracks[0];
                await queue.addTracks(song)
                embed
                    .setDescription(`**[${playlist.title}](${playlist.url})** adicionada à fila.`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({ text: `Duração: ${song.duration}` }); 
        }

        if (!queue.playing) await queue.play();
        await interaction.editReply({
            embeds: [embed]
        })
    }
}