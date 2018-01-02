<div align="center">
    <!-- <img src="http://zekro.de/dl/knechtv2-avatar.png" width="250"/> -->
    <h1> ~ Karen ~ </h1>
    <strong>Server management bot of zekro's private Gaming Discord</strong><br/><br/>
    <a href="https://stats.uptimerobot.com/WPBJjHp26"><img src="https://img.shields.io/uptimerobot/status/m779430970-e7fbeac99e0f5b24c277880c.svg"/></a>&nbsp;
    <a href="https://stats.uptimerobot.com/WPBJjHp26"><img src="https://img.shields.io/uptimerobot/ratio/m779430970-e7fbeac99e0f5b24c277880c.svg"/></a>&nbsp;
    <a href=""><img src="https://img.shields.io/github/languages/top/zekroTJA/KarenBot.svg"/></a>
</div>

---

> **DISCLAIMER:**
> This bot is just created for managing my private gaming Discord server, but I thought the functions of this bot may be interisting for educating purpose. If you want to run this bot on your own guild (this bot may only run well on only one single guild!), you need to set all constants in the main class for your personal guild settings.

---

## Functions

### Game Roles

The bot gives roles to members by analizing the game presence status of the members.
<br>

### Autoclear Channels

You can set a channel as autoclear channel by ID. Then, you can set the timeout with a parameter in the channels topic. Then, all messages send in this channel will be deleted automatically from the bot after this delay.
<br>

### VPS Server Stats

On my VPS, there are some game servers running. They are running with the screen application for linux. With a command, you can create messages, which will be refreshed every 10 seconds, where server stats like CPU and memory load will be displayed. Also, you can set names of game servers how they are displayed in the command 'screen -ls'. Then, the bot executes this command (*`screen -ls`*) and will check, if the servers name is present in this output. Then, the message will show, if the server is currently online or offline.
<br>

### Welcome message with role activation

You can set a specific channel as welcome channel. Then, the bot will send a message (which content you can also set as constant variable in the main class) with a ✅ reaction attached.  
If someone joins the guild, he will only see this one channel (you need to set the permissions for the member role and the @everyone role for this for all channels and categories). After accepting the rules with pressing on the reaction, the user will get the defined member role and will be able to see all other channels after that.

### Some special features and commands

Especially for our DST server, the bot contains a command, where you can see how to connect to my DST server. In this message, the online state of the server is displayed as well as the password, which is directly read out of the servers settings file, so you dont need to mind about changing stuff in the bots code after chaning the password of the server.