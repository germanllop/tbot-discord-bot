const express = require('express')
const router = express.Router()

router.get('/',async (req, res)=>{
    res.send('TBOT TBOT TBOT')
})

module.exports = router