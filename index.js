import {Client, GatewayIntentBits, Collection} from 'discord.js'
import 'dotenv/config'
import fs from 'fs';

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]})
client.commands = new Collection()
client.slcommands = new Collection()
client.prefix = process.env.PREFIX

client.owners = [
        // put your discord id/other sysadmins' ids here
]

const norcommandFolders = fs.readdirSync('./commands');
for (const norfolder of norcommandFolders) {
        const norcommandFiles = fs
                .readdirSync(`./commands/${norfolder}`)
                .filter(norfile => norfile.endsWith('.js'));
        for (const norfile of norcommandFiles) {
                const norcommand = await import(`./commands/${norfolder}/${norfile}`);
                client.commands.set(norcommand.name, norcommand);
        }
}

client.slcommands = new Collection();
const slcommandFolders = fs.readdirSync('./slcommands');
for (const slfolder of slcommandFolders) {
        const slcommandFiles = fs
                .readdirSync(`./slcommands/${slfolder}`)
                .filter(slfile => slfile.endsWith('.js'));
        for (const slfile of slcommandFiles) {
                const slcommand = await import(`./slcommands/${slfolder}/${slfile}`);
                client.slcommands.set(slcommand.name, slcommand);
        }
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
        const event = await import(`./events/${file}`);
        try{
        if (event.once) {
                client.once(event.name, async (...args) => await event.execute(...args, client));
        } else {
                client.on(event.name, async (...args) => await event.execute(...args, client));
        }
} catch(err) {
        console.log(err)
}
}

client.login(process.env.TOKEN)