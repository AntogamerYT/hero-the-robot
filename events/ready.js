import {ActivityType} from 'discord.js';

export const name = 'ready';
export const once = true;
export async function execute(client){
        console.log(`Logged in as ${client.user.tag}!`)
    client.user.setActivity('coming soon!', {type:  ActivityType.Watching})
}