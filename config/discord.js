const Discord = require('discord.js')
const client = new Discord.Client()
const discordController = require('../controllers/discord')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", discordController)

module.exports = client
