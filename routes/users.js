const express = require('express')
const router = express.Router()
const User = require('../models/user')
const helper = require('../routes/helper')
const auth = require('./auth')

//List all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.json(users)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

//List one User
router.get('/:id', helper, (req,res) => {
    res.json(res.user)
})

//create a new User
router.post('/', async (req,res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//User login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({message: 'Login Failed! Check Aunthetication'})
        }
        const token = await user.generateAuthToken()
            console.log({user})
        res.send({user, token})
    } catch(err) {
        //console.log(token)
        res.status(400).send({message: 'bad request'})
    }
})
    
//user me
router.get('/me', auth, async(req, res) => {
    //view logged in user profile
    res.send(req.user)
})

//user log out
router.post('/me/logout', auth, async(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send(err)
    }
})

//Update a user
router.patch('/:id', helper, async (req, res) => {
    if (req.body.name != null) {
        res.user.name = req.body.name 
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    try {
        const updateUser = await res.user.save()
        res.json(updateUser)
    } catch(err) {
        res.status(400).json({message: err.message})
    }
})

//Delete a User
router.delete('/:id', helper, async (req, res) => {
    try {
        await res.user.remove()
        res.json({message: 'user is deleted'})
    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router