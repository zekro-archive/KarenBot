const Eris = require('eris')
const Main = require('./main')
const fs = require('fs')
const EventEmitter = require('events')

// Creating event emitter class
// and creatign an instance of it
class Emitter extends EventEmitter {}
var event = new Emitter()

// Creating eris bot instance with token from main class
var bot = new Eris(Main.token)

bot.on('ready', () => {
    console.log('Succcessfuyll logged in eris client')
    // File 'WELCOMEMSG.tmp' will be read and old welcome message
    // will be deleted with the ID's from the file
    // Then, the 'loggedin' event will be emited
    fs.readFile('WELCOMEMSG.tmp', 'utf8', (err, res) => {
        if (!err && res) {
            try {
                bot.deleteMessage(res.split('|')[1], res.split('|')[0], 'Bot restart')
            } catch (ex_err) { /* Don't know if i wanna handle those errors here ^^ */}
        }
        event.emit('loggedin')
    })
})

/**
 * Login the bot instance.
 * After logging in and deleting the message, the discord.js
 * bot will be logged in. Thats because the js bot would create
 * the welcome message first and writing its IDs in the file and THEN
 * the eris bot would delete exactly this file after. So the eris bot
 * shoudl delete forst the old message, and THEN start the js bot creating
 * the new welcome message and saving it into the file.
 * @param {function} cb Callback
 */
exports.login = (cb) => {
    bot.connect().catch(err => console.log(`Logging in failed!\n ${err}`))
    event.on('loggedin', cb)
}

exports.bot = bot
exports.event = event