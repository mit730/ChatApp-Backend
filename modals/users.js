const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 6
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)