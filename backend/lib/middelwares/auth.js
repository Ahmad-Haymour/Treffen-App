const User = require("../../models/User")


module.exports = async(req, res, next)=>{
    const token = req.cookies['user-token']

    if(!token){
        const error = new Error('Du musst dich einloggen!')
        error.status = 401
        return next(error)
    }

    const user = await User.findOne().where('token').equals(token)
    if(!user){
        const error = new Error('Dein Token ist nicht meht gültig!')
        error.status = 401
        return next(error)
    }

    req.user = user
    next()
}