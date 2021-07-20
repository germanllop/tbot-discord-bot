const mongoose = require('mongoose')

const priceSchema = new mongoose.Schema({
  ethTbot:{
    type:String,
    default:''
  },
  tbotEth: {
    type:String,
    default:''
  },
  tbotUsdc:{
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
  }
},{
  timestamps:true
})


const Price = mongoose.model('Price', priceSchema)

module.exports = Price