import {exec} from 'child_process';
import fs from 'fs';
import fsp from "fs/promises";
import { WebhookClient } from 'discord.js';
const adminNotify = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN});
export const name = 'forwardport';
export async function execute(client, interaction) {
    const host = interaction.options.getString('host');
    let generassl = interaction.options.getBoolean('generatessl');
    let da = interaction.options.getString('from');
    if(!da.includes(":")) da = da + ":80";
    if(!da || da.length > 200 || !host || host.length > 200 || !/^[a-zA-Z0-9.-]+$/.test(host)) return interaction.reply({content: 'Nice try', ephemeral: true});
    if(fs.existsSync(`/etc/nginx/sites-enabled/${host}.conf`)) {
        return interaction.reply({content: 'The site already exists', ephemeral: true});
    }
    await fsp.writeFile(`/etc/nginx/sites-enabled/${host}.conf`, 
`server {
    server_name ${host};
    location / {
            proxy_pass http://${da};
            proxy_set_header Host $host;
            proxy_pass_request_headers on;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            fastcgi_read_timeout 7d;
            proxy_read_timeout 7d;
            proxy_connect_timeout 7d;
            proxy_send_timeout 7d;
            proxy_max_temp_file_size 0;
            proxy_buffering off;
            client_max_body_size 900G;
            send_timeout 7d;
    }
}`);
    exec(`/usr/bin/systemctl reload nginx`, (err, stdout, stderr) => {
        adminNotify.send(`${host} ADDED TO NGINX\n${stdout?stdout:"Success"} ${stderr?stderr:"No stderr"} ${err?err.toString():"No error"}`);
        if(err) return interaction.reply({content: 'Nginx error', ephemeral: true});
        if(!generassl) return interaction.reply('OK');
        exec(`/usr/bin/certbot --non-interactive --agree-tos -m ${process.env.MAIL} --nginx -d ${host}`, (err, stdout, stderr) => {
            adminNotify.send(`${host} ADDED TO NGINX WITH CERTBOT\n${stdout?stdout:"Success"} ${stderr?stderr:"No stderr"} ${err?err.toString():"No error"}`);
            if(stdout.includes("Congratulations")) return interaction.reply({content: 'Site added successfully, but SSL failed.', ephemeral: true});
            interaction.reply('OK');
        });
    })
    
}