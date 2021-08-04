const express = require('express')
const router = express.Router()
const client = require('../config/discord')

router.post('/verifyDiscord',async (req, res)=>{
    const { code, discordName } = req.body
    if(!code || !discordName) return res.sendStatus(400)

    console.log(discordName, code)

    const user = client.users.cache.find(u => u.tag == discordName)
    if(!user) {
        const guild = client.guilds.cache.get('856686688034226187')
        const guildMembers = guild.members.fetch({
            query:discordName,
            limit: 1
         })
         const member = guildMembers.first()

        if(!member){
            console.log('No user')
            return res.send('nouser')
        }else{
            member.send(`Your TBOT Army Verification code is: ${code}`)
            return res.send('OK')
        }
    }

    user.send(`Your TBOT Army Verification code is: ${code}`)
    res.send('OK')
})



module.exports = router