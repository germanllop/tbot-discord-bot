const Discord = require('discord.js')
const Reply = require('../models/reply')
const Price = require('../models/price')
const Liquidity = require('../models/liquidity')
const {takeScreenshot} = require('../controllers/screenshot')
const ChartJSImage = require('chart.js-image')
const {uploadAndDestroy} = require('../controllers/skynet')

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
            value: `${price.ethTbot} TBOT`,
            inline: true
          }, {
            name: '1 TBOT',
            value: `${price.tbotEth} ETH`,
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
            value: `${parseFloat(price.tbotUsdc).toFixed(2)} USDC`, // tbotusdc
            inline: true
          }
          )
          .setTimestamp()

        message.channel.send(embed)
      }, 2000)

    } else if (command === "graph") {

      const price = await Price.find({}, {}, {
        sort: {
          'createdAt': -1
        },
        limit:10
      })

      const labels = price.map(p=>{
        return `${p.createdAt.getHours()}:${p.createdAt.getMinutes()}`
      })

      const data = price.map(p=>{
        return parseFloat(p.tbotUsdc)
      })

      const parameters = {
        "type": "line",
        "data": {
          "labels": [...labels],
          "datasets": [
            {
              "borderColor": "rgb(255,+99,+132)",
              "backgroundColor": "rgba(255,+99,+132,+.5)",
              "data": [...data]
            }
          ]
        },
        "options": {
          "title": {
            "display": false,
          },
          "scales": {
            "xAxes": [
              {
                "scaleLabel": {
                  "display": true,
                  "labelString": "Date"
                }
              }
            ],
            "yAxes": [
              {
                "stacked": true,
                "scaleLabel": {
                  "display": true,
                  "labelString": "USDC"
                }
              }
            ]
          }
        }
      }

      // console.log(parameters.data.labels)

      const lineChart = ChartJSImage().chart(parameters) // Line chart
      .backgroundColor('white')
      .width(500) // 500px
      .height(300) // 300px

      await lineChart.toFile('chart.png')

      const link = await uploadAndDestroy('chart.png')
      console.log(link)

      // setTimeout(() => {
      //   const embed = new Discord.MessageEmbed()
      //     .setColor('#7289da')
      //     .setTitle('ETH/TBOT Price Graph')
      //     .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
      //     .setImage(shot)
      //     .setTimestamp()

      //   message.channel.send(embed)
      // }, 2000)

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