const Discord = require('discord.js')
const Reply = require('../models/reply')
const Price = require('../models/price')
const User = require('../models/user')
const Liquidity = require('../models/liquidity')
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
      message.reply(`You have to wait ${timeLeft.toFixed(1)} seconds to use that command again.`)
      return message.delete()
    }
  } else {

    const reply = await Reply.findOne({
      command: command
    }).exec()

    if (reply) {

      message.reply(reply.reply) // Send predefined text replies, like ping pong

    // } else if (command === "price" && message.channel.name === process.env.TEXT_CHANNEL) { // If there is only one channel to respond
    } else if (command === "price") {

      const {getPosition} = require('../controllers/unigraph')

      const tbotEth = {id:'50722', token0:'TBOT', token1:'ETH'}
      const usdcEth = {id:'10001', token0:'USDC', token1:'ETH'}

      const priceTbotEth = await getPosition(tbotEth)
      const priceUsdcEth = await getPosition(usdcEth)

      const price= await Price.create({
        tbotEth: priceTbotEth.price,
        ethTbot: priceTbotEth.priceReversed,
        tbotUsdc:(parseFloat(priceTbotEth.price)*parseFloat(priceUsdcEth.priceReversed)).toFixed(2),
        usdcEth: priceUsdcEth.price,
        ethUsdc:priceUsdcEth.priceReversed

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

      const {getLiquidityInfo} = require('../controllers/unigraph')

      const liquidity = await getLiquidityInfo()

      await Liquidity.create({
        ethTbot:liquidity.ethTbot,
        tbotEth:liquidity.tbotEth,
        tbotLocked:liquidity.tbotLocked,
        ethLocked:liquidity.ethLocked,
        tvl:liquidity.tvl,
        volume24h:liquidity.volume24h,
        fees24h:liquidity.fees24h
      })

      setTimeout(() => {
        const embed = new Discord.MessageEmbed()
          .setColor('#7289da')
          .setTitle('TBOT Current Uniswap Liquidity')
          .setAuthor('t-botmonitor', 'https://cdn.discordapp.com/icons/856686688034226187/779e516a1bf47d474b11074f6f91e5e7.png?size=128', 'https://tbotarmy.com')
          .addFields({
            name: '1 ETH',
            value: `${liquidity.ethTbot.toFixed(4)} TBOT`,
            inline: true
          }, {
            name: '1 TBOT',
            value: `${parseFloat(liquidity.tbotEth).toFixed(4)} ETH`,
            inline: true
          }, {
            name: 'Total Tokens Locked',
            value: `TBOT: ${parseFloat(liquidity.tbotLocked).toFixed(2)} / ETH: ${parseFloat(liquidity.ethLocked).toFixed(2)}`
          }, {
            name: 'TVL',
            value: `${new Intl.NumberFormat('en-US', { notation: 'compact',style: 'currency', currency: 'USD' }).format(parseFloat(liquidity.tvl))}`,
            inline: true
          }, {
            name: 'Volume 24h',
            value: ` ${new Intl.NumberFormat('en-US', { notation: 'compact',style: 'currency', currency: 'USD' }).format(parseFloat(liquidity.volume24h))}`,
            inline: true
          }, {
            name: '24h Fees',
            value: ` ${new Intl.NumberFormat('en-US', { notation: 'compact',style: 'currency', currency: 'USD' }).format(parseFloat(liquidity.fees24h))}`,
            inline: true
          })
          .setTimestamp()

        message.channel.send(embed)
      }, 2000)

    }else if (command === "verifyme") {
      const user = await User.findOne({discord:`${message.author.username}#${message.author.discriminator}`})
      if(!user) {
        message.author.send('Please sign up at https://tbotarmy.com/')
        return message.delete()
      }


      if(!user.verifiedDiscord && user.discordCode){
        message.author.send(`Your TBOT Army Verification code is: ${user.discordCode}`)
      }else if(user.verifiedDiscord){
        message.author.send('You are verified! Cool!')
      }else{
        message.author.send('Please generate your verification code at https://tbotarmy.com/my-account')
      }
      message.delete()
    }


    if (message.author.id != process.env.ADM_ID) {
      timestamps.set(message.author.id, now)
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
    }
  }

}

module.exports = discordController