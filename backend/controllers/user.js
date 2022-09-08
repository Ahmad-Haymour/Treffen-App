const User = require("../models/User")
const bcrypt = require('bcrypt')
const crypto = require('crypto')


exports.register = async(req, res, next)=>{
    const user = new User(req.body)
    user.password = await bcrypt.hash(user.password, 10)
    user.token = crypto.randomBytes(64).toString('hex')

    await user.save()
    res.cookie('user-token', user.token, {maxAge: 9999999, sameSite: 'strict', httpOnly: true})

    res.status(200).send(user)
}

exports.login = async(req, res, next) =>{
    const {email, password} = req.body
    const user = await User.findOne().where('email').equals(email)

    if(!user){
        const error = new Error('Falsche E-Mail adresse!')
        error.status = 400
        return next(error)
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if(!isPasswordCorrect){
        const error = new Error('Dein Passwort stimmt nicht!!')
        error.status = 400
        return next(error)
    }

    user.token = crypto.randomBytes(64).toString('hex')
    await user.save()

    res.cookie('user-token', user.token, {maxAge:999999, sameSite: 'strict', httpOnly: true} )

    res.status(200).send(user)
}

exports.getUsers = async(req, res, next) =>{
    const users = await User.find( {}, 'email token -_id')
    console.log(users);
    res.status(200).send(users)
}

exports.getSingleUser = async (req, res, next)=>{
    const {id} = req.params
    const user = await User.findById(id)
    if(!user){
        const error = new Error('User not found')
        error.status = 400
        return next(error)
    }
    res.status(200).send(user)
}

exports.logout = async(req, res, next)=>{
    const token = req.token
    const user = await User.findOne().where('token').equals(token)
    if(!user){
        user.token = ''
        await user.save()
    }
    res.cookie('user-token', '', {minAge: 1, sameSite: 'strict', httpOnly: true})
    res.status(200).end()
}