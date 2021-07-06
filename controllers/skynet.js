const skynet = require('@nebulous/skynet')
const client = new skynet.SkynetClient()
const fs = require('fs')

const uploadAndDestroy = async function(file){
  const skylink = await client.uploadFile(file)

  fs.unlinkSync(file)

  return skylink.replace('sia://', 'https://siasky.net/')
}

module.exports = {uploadAndDestroy}