export const name = 'messageCreate';
export async function execute(message, client) {
    if (!message || message.partial)
        return;
    if (message.author.bot)
        return;
    const prefix = client.prefix;
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}> |${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content.toLowerCase()))
        return;
    const [, matchedPrefix] = message.content.toLowerCase().match(prefixRegex);
    message.ment = message.mentions.members?.first();
    message.fullments = message.mentions.members?.map(m => m) ?? [];
    const args = message.content.slice(matchedPrefix.length).split(/ +/);;
    if (!message.content.toLowerCase().startsWith(`${matchedPrefix.toLowerCase()}`) || message.author.bot)
        return;

    const comm = args.shift().toLowerCase();
    const command = client.commands.get(comm) ||
        client.commands.find(a => a.aliases && a.aliases.includes(comm));
    if (command) {
        if (!command.allowDMs && !message.guild)
            return;
        try {
            command.execute(client, message, args);
        } catch (error) {
            console.error(error);
            message.channel.send("C'è stato un errore durante l'esecuzione del comando.");
        }
    }
}