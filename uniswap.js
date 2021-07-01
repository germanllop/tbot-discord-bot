(async ()=>{
  require('dotenv').config()
  const { ChainId, Token, WETH, Fetcher, Pair, Route } = require('@uniswap/sdk')
  const uniswap3 = require('@uniswap/v3-sdk')
  const ethers = require('ethers')
  const Web3 = require('web3')
  const provider = new ethers.providers.EtherscanProvider('homestead',process.env.ETHSCAN_API)
  const chainId = ChainId.MAINNET
  const tokenAddress = await Web3.utils.toChecksumAddress('0xa4f2fdb0a5842d62bbaa5b903f09687b85e4bf59')

  // const TBOT = new Token(chainId, tokenAddress, 18)
  const TBOT = await Fetcher.fetchTokenData(chainId, tokenAddress, provider)

  const TBOT3 = awa

  // note that you may want/need to handle this async code differently,
  // for example if top-level await is not an option
  const pair = await Fetcher.fetchPairData(TBOT, WETH[TBOT.chainId], provider)

  const route = new Route([pair], WETH[TBOT.chainId])

  console.log(route.midPrice.toSignificant(6))
  console.log(route.midPrice.invert().toSignificant(6))

  console.log(pair)
})().catch(err=>console.log(err))