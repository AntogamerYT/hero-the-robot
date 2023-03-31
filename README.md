# Hero the robot

![Hero](https://github.com/AntogamerYT/assets/raw/main/Hero.png)

Initially made with [ShiSHcat](https://github.com/ShiSHcat) for private use to manage a proxmox server, then we decided to opensource it.

## Requirements

- Iptables, without it port forwarding won't work
- Certbot, for SSL certificates
- Nginx, to manage site forwarding (proxy_pass)
- NodeJS 16.9+

## Running the bot
- First of all, fill the `.env.example` file with all the tokens and infos and rename it into `.env`
tip: GUILD_ID will be the guild where the slash commands will be registered
- (Not needed) open index.js and put your Discord ID to use the addsl and eval commands 
- Run `npm install` to install the required packages
- Finally, run `node .`

After getting your bot up and running, make sure to finish everything by using the `addsl` command to set all the slash commands.

