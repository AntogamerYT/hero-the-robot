import { ApplicationCommandOptionType, ApplicationCommandType } from 'discord.js';
export const name = 'addsl';
export const aliases = ['addglobalsl'];
export async function execute(client, message, args) {
    const adds = [
        {
            name: 'forwardport',
            description: 'Forward a port.',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'porta',
                    description: 'Port to forward',
                    type: ApplicationCommandOptionType.Number,
                    required: true
                },
                {
                    name: 'from',
                    description: 'Ip to forward from (Tip: insert the ip of your proxmox container/VM)',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'unforwardport',
            description: 'Unforwards a port.',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'port',
                    description: 'Port to remove.',
                    type: ApplicationCommandOptionType.Number,
                    required: true
                },
                {
                    name: 'from',
                    description: 'Ip to remove the forward from (Tip: insert the ip of your proxmox container/VM)',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        },
        {
            name: 'forwardsite',
            description: 'Forwards a site using nginx proxy pass and host names.',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'host',
                    description: 'Your domain (can also be a subdomain).',
                    type: ApplicationCommandOptionType.Number,
                    required: true
                },
                {
                    name: 'from',
                    description: 'Ip to forward from (Tip: insert the ip of your proxmox container/VM)',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'generatessl',
                    description: 'Generates an SSL certificate.',
                    type: ApplicationCommandOptionType.Boolean,
                    required: true
                }
            ]
        },
        {
            name: 'unforwardsite',
            description: 'Removes a forwarded site.',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'host',
                    description: 'The forwarded domain (can also be a subdomain).',
                    type: ApplicationCommandOptionType.Number,
                    required: true
                }
            ]
        },
        {
            name: 'addssl',
            description: 'Adds an SSL certificate to an already forwarded site (If it was not added before).',
            type: ApplicationCommandType.ChatInput,
            options: [
                {
                    name: 'host',
                    description: 'Insert the domain you forwarded (can also be a subdomain).',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }
    ];
    if (!client.owners.includes(message.author.id))
        return;
    if (message.content.toLowerCase().startsWith(`${client.prefix}addsl`)) {
        message.member.user.send('Process initialized');
        await client.guilds.cache.get(process.env.GUILD_ID)?.commands.fetch();
        if (args.length) {
            const names = args.join(' ').trim().split(',');
            let r = [];
            for (let name of names) {
                let comm = adds.find(n => n.name == name);
                if (comm) {
                    r.push(name);
                    await client.guilds.cache.get(process.env.GUILD_ID)?.commands.create(comm);
                }
            }
            return message.member.user.send(`Operation succeded. \n${r.length} commands have been added or updated`);
        }
        await client.guilds.cache.get(process.env.GUILD_ID)?.commands?.set(adds);
        message.member.user.send(`Operation succeded. \n${adds.length} commands have been added or updated`);
    }
    else {
        message.member.user.send('Global Process initialized');
        await client.application.commands.fetch();
        if (args.length) {
            const names = args.join(' ').trim().split(',');
            let r = [];
            for (let name of names) {
                let comm = adds.find(n => n.name == name);
                if (comm) {
                    r.push(name);
                    await client.application.commands.create(comm);
                }
            }
            return message.member.user.send(`Operation succeded. \n${r.length} commands have been added or updated`);
        }
        await client.application.commands.set(adds);
        message.member.user.send(`Operation succeded. \n${adds.length} commands have been added or updated`);
    }
}