import {exec} from 'child_process';
import { WebhookClient } from 'discord.js';
const adminNotify = new WebhookClient({id: process.env.WEBHOOK_ID, token: process.env.WEBHOOK_TOKEN});
export const name = 'forwardport';
export async function execute(client, interaction) {
    const port = interaction.options.getNumber('port');
    if(port < 1 || port > 65535) return interaction.reply({content: 'Invalid port', ephemeral: true});
    let da = interaction.options.getString('from');
    if(!da.includes(":")) da = da + ":" + port;
    if(!da || da.length > 200 || !validateIpAndPort(da)) return interaction.reply({content:  'Nice try', ephemeral: true});
    await exec(`/usr/sbin/iptables -L -t nat | grep "dpt:${port}"`, async(err, stdout, stderr) => {
        stdout = stdout.trim();
        if(stdout == '') {
            await exec(`/usr/sbin/iptables -t nat -A PREROUTING -p tcp --dport ${port} -j DNAT --to-destination ${da}`, async(err, stdout, stderr) => {
                stdout = stdout.trim();
                if(stdout == '') {
                    await interaction.reply('OK');
                } else {
                    await interaction.reply({content: "Something went wrong, an admin was notified", ephemeral: true});
                }
                await adminNotify.send(`Forwarded ${port} to ${da}\n\n${stdout?stdout:"Success"} ${stderr?stderr:"No stderr"} ${err?err.toString():"No error"}\nCommand executed by ${interaction.user.tag} (${interaction.user.id})`);
            })
        } else {
            await interaction.reply({content: "The port is already used", ephemeral: true});
        }
    });

}
function validateIpAndPort(input) {
    var parts = input.split(":");
    var ip = parts[0].split(".");
    var port = parts[1];
    return validateNum(port, 1, 65535) &&
        ip.length == 4 &&
        ip.every(function (segment) {
            return validateNum(segment, 0, 255);
        });
}

function validateNum(input, min, max) {
    var num = +input;
    return num >= min && num <= max && input === num.toString();
}