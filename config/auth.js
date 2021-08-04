module.exports = function (req, res, next){
  if(!req.header('authorization')) return res.sendStatus(400)
  const token = req.header('authorization').split(' ')[1]
  if(!token) return res.sendStatus(400)
  if(token != process.env.TBOT_API_ACCESS_KEY) return res.sendStatus(401)
  next()
}