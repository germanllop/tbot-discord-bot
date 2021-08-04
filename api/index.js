const express = require('express')
const router = express.Router()
const client = require('../config/discord')

router.post('/verifyDiscord',async (req, res)=>{
    const { code, discordName } = req.body
    if(!code || !discordName) return res.sendStatus(400)
    const user = client.users.cache.find(u => u.tag === discordName)
    if(!user) return res.send('nouser')

    user.send(`Your TBOT Army Verification code is: ${code}`)
    res.send('OK')
})



module.exports = router