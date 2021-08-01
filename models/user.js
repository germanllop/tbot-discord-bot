const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    discord: {
      type: String
    },
    verifiedDiscord: {
      type: Boolean
    },
    discordCode:{
      type: String
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('User', userSchema)