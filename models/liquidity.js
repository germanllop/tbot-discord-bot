const mongoose = require('mongoose')

const liquiditySchema = new mongoose.Schema({
  ethTbot:{
    type:String,
    default:''
  },
  tbotEth: {
    type:String,
    default:''
  },
  tbotLocked:{
    type:String,
    default:''
  },
  ethLocked:{
    type:String,
    default:''
  },
  tvl:{
    type:String,
    default:''
  },
  volume24h:{
    type:String,
    default:''
  },
  fees24h:{
    type:String,
    default:''
  }
},{
  timestamps:true
})


const Liquidity = mongoose.model('Liquidity', liquiditySchema)

module.exports = Liquidity