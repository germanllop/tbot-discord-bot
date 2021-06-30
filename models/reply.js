const mongoose = require('mongoose')

const replySchema = new mongoose.Schema({
  command: {
    type: String,
    default: ""
  },
  reply:{
    type: String,
    default: ""
  }
})

replySchema.index({command: 'text'})

const Reply = mongoose.model('Reply', replySchema)

module.exports = Reply