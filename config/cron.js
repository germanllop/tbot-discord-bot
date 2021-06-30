const CronJob = require('cron').CronJob
const puppeteer = require('puppeteer')
const skynet = require('@nebulous/skynet')
const client = new skynet.SkynetClient()
const Price = require('../models/price')
const fs = require('fs')


const JobPrice = new CronJob('00 */5 * * * *', async function() {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const pageConfig = {
    waitUntil: 'networkidle2'
  }
  await page.goto('https://app.uniswap.org/#/swap?inputCurrency=0xa4f2fdb0a5842d62bbaa5b903f09687b85e4bf59&outputCurrency=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', pageConfig)
  await page.waitForSelector('body > reach-portal > div:nth-child(3) > div > div > div > div > div > button')
  await page.click('body > reach-portal > div:nth-child(3) > div > div > div > div > div > button')
  await page.waitForTimeout(5000)
  await page.type('#swap-currency-input > div > div > input', '1')
  await page.waitForSelector('#swap-page > div > div > div:nth-child(2) > button > div > div')
  const elem = await page.$('#swap-page > div > div > div:nth-child(2) > button > div > div')
  await elem.screenshot({path:'price1.jpg'})
  const price1 = await elem.evaluate(el=>el.textContent)
  await elem.click()
  const price2 = await elem.evaluate(el=>el.textContent)
  console.log(price1,price2)
  await elem.screenshot({path:'price2.jpg'})

  const skylink1 = await client.uploadFile('price1.jpg')
  const skylink2 = await client.uploadFile('price2.jpg')
  fs.unlinkSync('price1.jpg')
  fs.unlinkSync('price2.jpg')

  const priceImpact = await (await page.$('reach-portal > div > div > div > div:nth-child(3) > div:nth-child(2) > div' )).evaluate(el=>el.textContent)

  await browser.close()
  const savedPrice = await Price.create({
    ethTbot:price1,
    ethTbotImage:skylink1.replace('sia://','https://siasky.net/'),
    tbotEth:price2,
    tbotEthImage:skylink2.replace('sia://','https://siasky.net/'),
    priceImpact:priceImpact
  })
  console.log(savedPrice)

})

module.exports = {JobPrice}