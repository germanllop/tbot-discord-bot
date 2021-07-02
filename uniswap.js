(async ()=>{
  require('dotenv').config()
  const { ChainId, Token, WETH, Fetcher, Pair, Route } = require('@uniswap/sdk')
  const uniswap3 = require('@uniswap/v3-sdk')
  const ethers = require('ethers')
  const Web3 = require('web3')
  const provider = new ethers.providers.EtherscanProvider('homestead',process.env.ETHSCAN_API)
  const chainId = ChainId.MAINNET
  // const tokenAddressTBOT = await Web3.utils.toChecksumAddress('0xa4f2fdb0a5842d62bbaa5b903f09687b85e4bf59')
  const tokenAddressUSDC = await Web3.utils.toChecksumAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')

  const USDC = await Fetcher.fetchTokenData(chainId, tokenAddressUSDC, provider)

  const pair = await Fetcher.fetchPairData(USDC, WETH[USDC.chainId], provider)

  const route = new Route([pair], WETH[USDC.chainId])

  console.log('1ETH ',route.midPrice.toSignificant(6))
  console.log('1USDC '+route.midPrice.invert().toSignificant(6))

  // console.log(pair)
})().catch(err=>console.log(err))