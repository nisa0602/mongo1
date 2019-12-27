const mongoose = require('mongoose')
const jwt = require('jsonwebtoken') //using jwt because we include token on our project
const validator = require('validator')
const bcrypt = require('bcryptjs') //bcrypt is a password hashing function

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    // biodata: {
    //     name: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     },
    //     gender: {
    //         type: String,
    //         required: true
    //     }
    // },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid Email addres'})
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    },
    //harus bikin array token ([]), supaya bisa menampung generated token yg ada type
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // address: {
    //     type: String,
    //     required: true
    // }
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

userSchema.pre('save', async function (next) {
    //Hash the password before saving the user model
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.methods.generateAuthToken = async function() {
    //Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY)
    // const token = jwt.sign({_id: user.id}, process.env.JWT_KEY, [options, callback])
    user.tokens = user.tokens.concat({token})
    
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    //Search for a user by email and password
    const user = await User.findOne({email})
    if (!user) {
        throw new Error({error: 'Invalid login credentials'})
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
        throw new Error({error: 'Invalid login credentials'})
    }
    console.log(user)
    return user
} 

const User = mongoose.model('User', userSchema)

module.exports = User