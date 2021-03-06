const CronJob = require('cron').CronJob
const puppeteer = require('puppeteer')
const Liquidity = require('../models/liquidity')

const JobLiquidity = new CronJob('30 7/10 * * * *', async function () {

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const pageConfig = {
    waitUntil: 'networkidle2'
  }

  await page.goto('https://info.uniswap.org/#/pools/0xb6c05fb8d5a242d92e72ce63c58ec94d93d11060', pageConfig)
  await page.waitForSelector('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)')
  const tbotEthElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child(1) > div > div > div')
  const ethTbotElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > a:nth-child(2) > div > div > div')

  const tbotLockedElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) ')
  const ethLockedElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2)')

  const tvlElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2)')
  const volume24hElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(3) > div:nth-child(2)')
  const fees24hElement = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(4) > div:nth-child(2)')

  const tbotEth = await tbotEthElement.evaluate(el => el.textContent).catch(err => console.log(err))
  const ethTbot = await ethTbotElement.evaluate(el => el.textContent).catch(err => console.log(err))
  const tbotLocked = await tbotLockedElement.evaluate(el => el.textContent).catch(err => console.log(err))
  const ethLocked = await ethLockedElement.evaluate(el => el.textContent).catch(err => console.log(err))
  const tvl = await tvlElement.evaluate(el => el.textContent).catch(err => console.log(err))
  const volume24h = await volume24hElement.evaluate(el => el.textContent).catch(err => console.log(err))
  const fees24h = await fees24hElement.evaluate(el => el.textContent).catch(err => console.log(err))

  await browser.close()
  const savedLiquidity = await Liquidity.create({
    tbotEth,
    ethTbot,
    tbotLocked,
    ethLocked,
    tvl,
    volume24h,
    fees24h
  })
  console.log(savedLiquidity)

})


module.exports = {
  // JobLiquidity
}