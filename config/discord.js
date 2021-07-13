const Discord = require('discord.js')
const client = new Discord.Client()
const discordController = require('../controllers/discord')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('guildMemberAdd', member => {
  member.guild.channels.get('856686688469516289').send(`Welcome #${member.guild.memberCount}`)
})

client.on("message", discordController)

module.exports = client
