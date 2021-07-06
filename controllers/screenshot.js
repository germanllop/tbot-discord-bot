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

  await page.goto(url, pageConfig)
  await page.waitForSelector(selector)
  const elem = await page.$(selector)

  await elem.screenshot({
    path: name + '.jpg'
  })
  await browser.close()

  const skylink = await client.uploadFile(name + '.jpg')

  fs.unlinkSync(name + '.jpg')

  return skylink.replace('sia://', 'https://siasky.net/')
}

module.exports = {takeScreenshot}