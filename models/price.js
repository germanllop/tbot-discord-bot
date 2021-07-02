const mongoose = require('mongoose')

const priceSchema = new mongoose.Schema({
  ethTbot:{
    type:String,
    default:''
  },
  ethTbotImage:{
    type:String,
    default:''
  },
  tbotEth: {
    type:String,
    default:''
  },
  ethUsdc:{
    type:String,
    default:''
  },
  usdcEth:{
    type:String,
    default:''
  },
  tbotEthImage:{
    type:String,
    default:''
  },
  priceImpact:{
    type:String,
    default:'0%'
  }
},{
  timestamps:true
})


const Price = mongoose.model('Price', priceSchema)

module.exports = Price