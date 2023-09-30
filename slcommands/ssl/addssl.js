import {exec} from 'child_process';
import fs from 'fs';
import fsp from "fs/promises";
import { WebhookClient } from 'discord.js';
const adminNotify = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN});
export const name = 'forwardport';
export async function execute(client, interaction) {
    const host = interaction.options.getString('host');
    if(!host || host.length > 200 || !/^[a-zA-Z0-9.-]+$/.test(host)) return interaction.reply({content: 'Nice try', ephemeral: true});
    exec(`/usr/bin/certbot --non-interactive --agree-tos --nginx -d ${host}`, (err, stdout, stderr) => {
        adminNotify.send(`${host} ADDED TO NGINX WITH CERTBOT\n${stdout?stdout:"Success"} ${stderr?stderr:"No stderr"} ${err?err.toString():"No error"}`);
        if(stdout.includes("Congratulations")) return interaction.reply({content: 'Added, but ssl failed', ephemeral: true});
        interaction.reply('OK');
    });
    return await interaction.reply({content: 'The site doesn\'t exist', ephemeral: true});
}
