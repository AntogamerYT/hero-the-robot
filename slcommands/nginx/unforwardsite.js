import {exec} from 'child_process';
import fs from 'fs';
import fsp from "fs/promises";
import { WebhookClient } from 'discord.js';
const adminNotify = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN});
export const name = 'forwardport';
export async function execute(client, interaction) {
    const host = interaction.options.getString('host');
    if(!host || host.length > 200 || !/^[a-zA-Z0-9.-]+$/.test(host)) return interaction.reply({content: 'Nice try', ephemeral: true});
    if(fs.existsSync(`/etc/nginx/sites-enabled/${host}.conf`)) {
        fs.renameSync(`/etc/nginx/sites-enabled/${host}.conf`, `./sites-bkp/${host}.conf.bak`);
    }
    exec(`/usr/bin/systemctl reload nginx`, (err, stdout, stderr) => {
        adminNotify.send(`${host} ADDED TO NGINX\n${stdout?stdout:"Success"} ${stderr?stderr:"No stderr"} ${err?err.toString():"No error"}`);
        interaction.reply('OK');
        if(err) return interaction.reply({content: 'Nginx error', ephemeral: true});
    });
    return await interaction.reply({content: 'The specified site doesn\'t exist', ephemeral: true});
}