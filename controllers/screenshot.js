const skynet = require('@nebulous/skynet')
const client = new skynet.SkynetClient()
const fs = require('fs')
const puppeteer = require('puppeteer')

async function takeScreenshot(url,selector) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const pageConfig = {
    waitUntil: 'networkidle2'
  }
  const name = new Date().getTime()

  await page.goto('https://www.dextools.io/app/uniswap/pair-explorer/0xb6c05fb8d5a242d92e72ce63c58ec94d93d11060', pageConfig)
  await page.waitForSelector('body > div.js-rootresizer__contents')
  const elem = await page.$('body > div.js-rootresizer__contents')

  await elem.screenshot({
    path: name + '.jpg'
  })
  await browser.close()

  const skylink = await client.uploadFile(name + '.jpg')

  fs.unlinkSync(name + '.jpg')

  return skylink.replace('sia://', 'https://siasky.net/')
}

module.exports = {takeScreenshot}