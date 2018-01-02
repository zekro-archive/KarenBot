/*
 * This bot is actually created for managing my gaming discord only,
 * but I thought, some functions of this bot meight be interisting
 * for educational purpose.
 * So, if you want to run this bot on your own guild (this bot might
 * only run well on only one single guild!), you need to set all
 * constants below for your personal guild setting!
 */

const { exec, execSync } = require('child_process')
const os = require('os-utils')
const os1 = require('os')
const Discord = require('discord.js')
const fs = require('fs')

// Creating client instance for discord.js
var client = new Discord.Client()
// Reading token from external token file and
// exporting it for outside usages
var token = fs.readFileSync('token.txt', 'utf8')
exports.token = token

// Importing ErisClient module
var ErisClient = require('./erisclient')


/* ####### CONSTANTS ####### */

const PREFIX = "!"
// This bot is hard coded for only one guild, which ID is set here
const GUILDID = "362162947738566657"
// Member role users will get after accepting welcome message
const MEMBER_ROLE = "362169804146081802"
// Channel for welcome message with accpet check
const WELCOMECHAN = "362162947738566659"
// Channels where messages will be autocleared
const AUTOCLEARCHAN = ["381119788493045769", "923174238428923489"]

// Roles set by name of games in profile
// (lowercase forced)
const GAMES = {
    "grand theft auto v": "GTAV",
    "league of legends": "League",
    "counter-strike: global offensive": "CSGO",
    "minecraft": "Minecraft",
    "pubg": "PUBG",
    "dota": "Dota2",
    "rainbow six": "R6S",
    "don't starve together": "DST"
}

// Message of the welcome message in welcome channel
const WELCOME_DESCRIPTION = 
    "Hey! :wave:\n\n" + 
    "Willkommen auf <@!221905671296253953>'s privatem Discord!\n\n" +
    "Damit sich alle hier wohlfühlen können solltest du allgemeine Regeln befolgen,\n" +
    "wie nicht spammen, keine nervige Werbung machen, nicht beleidigen, immer\n" +
    "freundlich und nett zu jedem sein... usw.\n\n" +
    "Wenn du nun auf die :white_check_mark: Reaction klickst bestätigst du diese\n" +
    "Regeln und bekommst Zugriff auf alle verfügbaren Channel. :wink: \n\n" +
    ":point_down:"

// Servers will be checked with the !serverstats command
// Key: Server Srceen Name; Value: Display Name
const SERVERS = {
    "DST Server": "DST",
    "FTBSkyblock": "FTB Skyblock",
    "vanilla_1-12-2": "MC Vanilla"
}

// Path to settings file of the DST server to read out the password
const SERVERINI = '/root/.klei/DoNotStarveTogether/Cluster_1/Master/server.ini'

/* ######################### */


var welcomemsg, timer, serverMsgs = []
exports.GUILDID = GUILDID


client.on('ready', () => {
    console.log(`Successfully logged in discord.js client (${client.guilds.array().length} servers)`)
    startServerTimer()

    // Get channel object from welcome chan ID
    var welcome = client.guilds.array()[0].channels.find(c => c.id == WELCOMECHAN)

    // Login in Eris client
    // After login, it will read the 'WELCOMEMSG.tmp' file and will clear
    // the old welcome message. AFTER THAT, the discord.js bot will resend
    // the new welcome message and will save channel ID and message ID in
    // the file 'WELCOMEMSG.tmp'
    // The welcome message must be resend after every restart, because
    // discord.js does not recognize changes from a message send before
    // the discord.js client instance was started.
    ErisClient.login(() => {
        welcome.send('', 
        new Discord.RichEmbed()
            .setDescription(
                WELCOME_DESCRIPTION
            ).setColor(0x02ed83))
            .then(m => { 
                m.react("\✅")
                welcomemsg = m
                fs.writeFile('WELCOMEMSG.tmp', `${m.id}|${m.channel.id}`, (err) => {
                    if (err)
                        console.log(`An error occured while creating WELCOMEMSG.mp file, that means, that welcome message will not be deleted after restarting the bot.\nError Message:\n${err}`)
                })
            })
    })

    // Set game
    client.user.setGame('Ich putz hier nur.')

    // Checks, if the game roles exists on the guild (by name)
    // if not, they will be created with the property, that they
    // will be mentionable
    // So I just need to add roles to the object I want to add a game
    // and after the next restart, the bot will create the roles
    // automatically
    for (var g in GAMES) {
        if (!client.guilds.array()[0].roles.find(r => r.name == GAMES[g]))
            client.guilds.array()[0].createRole({
                name: GAMES[g],
                mentionable: true
            })
    }
})

client.on('guildMemberAdd', (memb) => {
    // When a new member joins the guild, his mention will be send into the
    // welcome channel and then deleted instantly after to create a mentioned
    // notification for the new member in this channel.
    memb.guild.channels.find(c => c.id == WELCOMECHAN).send(`<@!${memb.id}>`)
        .then(m => m.delete())
})

client.on('message', (msg) => {

    // If this channel is set as an autoclear channel, the message will be
    // deleted after a set time.
    // The delay is set in the channel topic and read out by the function
    // getDeleteTime(channel)
    if (AUTOCLEARCHAN.find(id => id == msg.channel.id)) {
        setTimeout(() => {
            msg.delete()
        }, getDeleteTime(msg.channel) * 1000)
    }

    // Little message command parser for some commands
    if (msg.content.startsWith(PREFIX)) {

        let invoke = msg.content.split(' ')[0].substr(PREFIX.length).toLowerCase()
        let args = msg.content.split(' ').slice(1)
        let chan = msg.channel
        let guild = msg.guild
        let author = msg.member

        switch (invoke) {

            // Creates a message and registers it in the array for server stats
            case "serverstats":
                if (msg.member.id == "221905671296253953")
                    msg.channel.send('*SERVER MESSAGE PLACEHOLDER*').then(m => serverMsgs.push(m))
                break

            // Displays connect information and server status of the DST server on my VPS
            case "dst":
                let passwd = fs.readFileSync(SERVERINI, 'utf8').split('server_password = ')[1].split('\n')[0]
                exec('screen -ls', (err, out) => {
                    let serverstatus = (out && out.indexOf('DST') > -1) ? "online" : "offline"
                    chan.send('', new Discord.RichEmbed()
                        .setColor(0xf1c40f)
                        .setDescription(
                            `Server Status: **${serverstatus}**\n\n` +
                            '__**Server Browser**__\n\n' +
                            '**1.** → *"Browse Games"*\n' +
                            '**2.** Suchen nach ```zekro DST```' +
                            '**3.** Auf *"Join"* klicken & Passwort eingeben\n\n' +
                            '__**Console**__\n' + 
                            '*Sollte der Server nicht im Server Browser erscheinen, so connecte einfach über die Console.*\n\n' +
                            '**1.** Console öffnen *(1)*\n' + 
                            '**2.** Folgendes eingeben:```c_connect("zekro.de")```\n' + 
                            '**3.** Passwort eingeben und joinen\n\n' + 
                            '__**Momentanes Passwort**__ *(aus server.ini)*\n' + 
                            '```' + passwd + '```\n\n' +
                            '___\n*(1) Um die Konsole öffnen zu können muss man dafür einen Key in den Settings einstellen. Siehe [Bild](http://zekro.de/ss/dontstarve_steam_2017-12-31_14-47-39.png).*')
                        .setImage('http://zekro.de/ss/dontstarve_steam_2017-12-31_14-47-39.png'))
                })
                break
        }
        // Deletes command message after parsing
        msg.delete()
    }

})


client.on('messageReactionAdd', (reaction, user) => {
    // Checks if a user added the ✅ reaction to the welcome message
    // After, the user gets the member role
    if (reaction.message.id == welcomemsg.id && user != client.user && reaction.emoji == "\✅") {
        let memb = reaction.message.guild.members.find(m => m.user == user)
        memb.addRole(memb.guild.roles.find(r => r.id == MEMBER_ROLE))
    }
})

client.on('presenceUpdate', (mold, mnew) => {
    // Read the Game Stats file, if it's present.
    // Else, a new file with a empty JSON Object will be created
    if (!fs.existsSync('GAMESTATS.json'))
        fs.writeFileSync('GAMESTATS.json', '{}')
    var stats = require('./GAMESTATS.json')
    // Checks if a member changes the game presence or if the
    // members game presence changed from 'null' to '!null'
    if (
        (!mold.presence.game && mnew.presence.game) ||
        (mold.presence.game != mnew.presence.game && mnew.presence.game)
    ) {
        // Adds the game to the list of games of a member and saves
        // it as a JSON object in the file
        var game = mnew.presence.game.name
        if (stats[mnew.id]) {
            if (stats[mnew.id].indexOf(game) == -1)
                stats[mnew.id] += ',' + game
        }
        else {
            stats[mnew.id] = game
        }
        fs.writeFileSync('GAMESTATS.json', JSON.stringify(stats))
        // If the game is containing in the games map, so the member will
        // get the corresponding role set in the map
        for (var g in GAMES) {
            if (game.toLowerCase().indexOf(g) > -1) {
                try {
                    mnew.addRole(mnew.guild.roles.find(r => r.name == GAMES[g]))
                } catch(err) {}
            }
        }
    }
})

/**
 * Get the delay time for autoclear channel out of the
 * channels topic.
 * If the channels topic is 
 * 'Autoclear Channel #1 | TIMEOUT=300'
 * the delay for deleting messages is 300 seconds.
 * @param {Discord.TextChannel} chan 
 * @returns {number} Timeout in seconds
 */
function getDeleteTime(chan) {
    return parseInt(chan.topic.split("TIMEOUT=")[1])
}

/**
 * Function which create a timer function, which will refresh the stats
 * of all server stats messages created with the '!serverstats' command
 * and saved in the Object 'serverMsgs'.
 */
function startServerTimer() {
    timer = setInterval(() => {

        os.cpuUsage((cpuUsage) => {

            /**
             * Cuts the number by the point and pads it to the minumum
             * length set by the parameter.
             * cut(3.14159, 3) -> '003'
             * @param {number} numb Number to cut
             * @param {number} ct Minimum length of number display
             * @returns {string} Transformed number
             */
            function cut(numb, ct) {
                let number = `${`${numb}`.split('.')[0]}`
                while (number.length < ct) {
                    number = '0' + number
                }
                return number
            }

            // Get current cpu usage, average of all cores
            let cpu = cpuUsage
            // Get average cpu usage of the last 10 minutes of all cores
            let cpuavg = os.loadavg(10)
            let mem = {
                // Total memory in bytes
                total: os1.totalmem(),
                // Free memory in bytes
                free: os1.freemem(),
                // Load in percent
                load: (os1.freemem() / os1.totalmem()) * 100
            }

            exec('screen -ls', (err, out) => {

                /**
                 * Checks if the server name is in the 'screen -ls' output
                 * @param {string} name 
                 * @returns {boolean}
                 */
                function isOnline(name) {
                    return out.indexOf(name) > -1
                }

                /**
                 * Checks if any of the listed server names is containing
                 * in the 'screen -ls' output
                 * @returns {boolean}
                 */
                function isAnyOnline() {
                    return Object.keys(SERVERS).filter(s => isOnline(s)).length > 0
                }

                serverMsgs.forEach(m => {
                    m.edit('', new Discord.RichEmbed()
                        .setColor(isAnyOnline() ? 0x2ecc71 : 0xe74c3c)
                        .setTitle('MC Servers online states')
                        .addField('VPS State', 
                            '```' +
                            `CPU Load:      ${cpu.toFixed(2)} \%\n` +
                            ` - avg 10 min: ${cpuavg.toFixed(2)}\%\n` +
                            `Memory Load:   ${mem.load.toFixed(2)} \%\n` +
                            '```'
                        )
                        .addField('Servers Stats',
                            Object.keys(SERVERS)
                                .map(s => `${isOnline(s) ? ':small_blue_diamond:' : ':small_red_triangle_down:'}  ${SERVERS[s]}`)
                                .join('\n')
                        )
                        .setTimestamp()
                        .setFooter('Wird alle 10 Sekunden aktualisiert')
                    )
                })
            })
        })
    }, 10000)
}

// logging in client with token from file
client.login(token)