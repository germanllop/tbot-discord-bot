const Discord = require('discord.js')
const Reply = require('../models/reply')
const Price = require('../models/price')
const Liquidity = require('../models/liquidity')
const {takeScreenshot} = require('../controllers/screenshot')

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

    // } else if (command === "price" && message.channel.name === process.env.TEXT_CHANNEL) { // If there is only one channel to respond
    } else if (command === "price") {
      const price = await Price.findOne({}, {}, {
        sort: {
          'createdAt': -1
        }
      })

      setTimeout(() => {
        const embed = new Discord.MessageEmbed()
          .setColor('#7289da')
          .setTitle('TBOT Current Trading Price')
          .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
          .addFields({
            name: '1 ETH',
            value: `${price.ethTbot.split('= ')[1]}`,
            inline: true
          }, {
            name: '1 TBOT',
            value: `${price.tbotEth.replace('WETH9','ETH').split('= ')[1]}`,
            inline: true
          },
          { name: '\u200B', value: '\u200B' },
          {
            name: '1 ETH',
            value: `${parseFloat(price.ethUsdc).toFixed(2)} USDC`, // ethusdc
            inline: true
          },
          {
            name: '1 TBOT',
            value: `${(parseFloat(price.ethUsdc)/parseFloat(price.ethTbot.split('= ')[1].replace('TBOT'))).toFixed(2)} USDC`, // ethusdc / ethtbot = tbotusdc
            inline: true
          }
          )
          .setTimestamp()

        message.channel.send(embed)
      }, 2000)
    } else if (command === "graph") {
      const url = 'https://www.dextools.io/app/uniswap/pair-explorer/0xb6c05fb8d5a242d92e72ce63c58ec94d93d11060'
      const selector = 'body > div.js-rootresizer__contents'
      const shot = await takeScreenshot(url,selector)

      setTimeout(() => {
        const embed = new Discord.MessageEmbed()
          .setColor('#7289da')
          .setTitle('ETH/TBOT Price Graph')
          .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
          .setImage(shot)
          .setTimestamp()

        message.channel.send(embed)
      }, 2000)

    } else if (command === "liquidity") {
      const liquidity = await Liquidity.findOne({}, {}, {
        sort: {
          'createdAt': -1
        }
      })

      setTimeout(() => {
        const embed = new Discord.MessageEmbed()
          .setColor('#7289da')
          .setTitle('TBOT Current Uniswap Liquidity')
          .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
          .addFields({
            name: '1 ETH',
            value: `${liquidity.ethTbot.split('= ')[1]}`,
            inline: true
          }, {
            name: '1 TBOT',
            value: `${liquidity.tbotEth.split('= ')[1]}`,
            inline: true
          }, {
            name: 'Total Tokens Locked',
            value: `TBOT: ${liquidity.tbotLocked} / ETH: ${liquidity.ethLocked}`
          }, {
            name: 'TVL',
            value: `${liquidity.tvl}`,
            inline: true
          }, {
            name: 'Volume 24h',
            value: `${liquidity.volume24h}`,
            inline: true
          }, {
            name: '24h Fees',
            value: `${liquidity.fees24h}`,
            inline: true
          })
          .setTimestamp()

        message.channel.send(embed)
      }, 2000)

    }

    if (message.author.id != process.env.ADM_ID) {
      timestamps.set(message.author.id, now)
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }
  }

}

module.exports = discordController