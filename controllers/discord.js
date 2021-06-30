const Discord = require('discord.js')
const Reply = require('../models/reply')
const Price = require('../models/price')
const Screenshot = require('../controllers/screenshot')

const prefix = '!'

const cooldowns = new Discord.Collection()

const discordController = async function (message) {
  if (message.author.bot) return
  if (!message.content.startsWith(prefix)) return

  const commandBody = message.content.slice(prefix.length)
  const args = commandBody.split(' ')
  const command = args.shift().toLowerCase()

  if (!cooldowns.has(command)) cooldowns.set(command, new Discord.Collection())
  const now = Date.now()
  const timestamps = cooldowns.get(command)
  const cooldownAmount = 1 * 60000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`You have to wait ${timeLeft.toFixed(1)} seconds to use that command again.`)
    }
  } else {

    const reply = await Reply.findOne({
      command: command
    }).exec()

    if (reply) {

      message.reply(reply.reply) // Send predefined text replies, like ping pong

    }else if (command === "parity" && message.channel.name === process.env.TEXT_CHANNEL) {

      const imageLink = await Screenshot.getParity()

      setTimeout(()=>{
        const matchDetails = new Discord.MessageEmbed()
        .setColor('#7289da')
        .setTitle('Parity TBOT-ETH Liquidity Pool')
        .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
        .setImage(imageLink)
        .setTimestamp()

        message.channel.send(matchDetails)
      },2000)

    }else if (command === "price" && message.channel.name === process.env.TEXT_CHANNEL){
      const price = await Price.findOne({},{},{sort:{ 'createdAt' : -1 } })

      setTimeout(()=>{
        const embed = new Discord.MessageEmbed()
        .setColor('#7289da')
        .setTitle('TBOT Current Trading Price')
        .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
        .addFields(
          { name: 'ETH-TBOT', value: `${price.ethTbot.replace('WETH9','ETH')}`},
          { name: 'TBOT-ETH', value: `${price.tbotEth.replace('WETH9','ETH')}`}
        )
        .setTimestamp()

        message.channel.send(embed)
      },2000)
    }else if (command === "graph" && message.channel.name === process.env.TEXT_CHANNEL){
      const price = await Price.findOne({},{},{sort:{ 'createdAt' : -1 } })
    }

    if (message.author.id != process.env.ADM_ID) {
      timestamps.set(message.author.id, now)
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }
  }

}

module.exports = discordController