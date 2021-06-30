const skynet = require('@nebulous/skynet')
const client = new skynet.SkynetClient()
const fs = require('fs')
const puppeteer = require('puppeteer')

async function getParity() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const pageConfig = {
    waitUntil: 'networkidle2'
  }
  const name = new Date().getTime()

  await page.goto('https://info.uniswap.org/#/pools/0xb6c05fb8d5a242d92e72ce63c58ec94d93d11060', pageConfig)
  await page.waitForSelector('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)')
  const elem = await page.$('#root > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div:nth-child(2) > div:nth-child(1)')
  await elem.evaluate((el) => {
    el.style.paddingTop = 15 + 'px'
    el.style.paddingBottom = 15 + 'px'
    el.style.paddingLeft = 10 + 'px'
    el.style.paddingRight = 35 + 'px'
  })

  await elem.screenshot({
    path: name + '.jpg'
  })
  await browser.close()

  const skylink = await client.uploadFile(name + '.jpg')

  fs.unlinkSync(name + '.jpg')

  return skylink.replace('sia://', 'https://siasky.net/')
}

module.exports = {getParity}