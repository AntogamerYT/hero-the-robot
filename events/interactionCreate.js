export const name = 'interactionCreate';
export async function execute(interaction, client) {
    if (!interaction || interaction.partial)
        return;
    if (interaction.user.bot)
        return;
    if (!interaction.guild)
        return;
    const cmd = client.slcommands.get(interaction.commandName) || client.slcommands.find(a => a.aliases?.includes(interaction.commandName));
    if (cmd) {
        try {
            await cmd.execute(client, interaction);
        } catch (err) {
            interaction[interaction.deferred ? 'editReply':'reply']({ content: 'Qualcosa    andato storto.', ephemeral: true });
            console.log(err);
        }
    }

}