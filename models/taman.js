const mongoose = require('mongoose')
// const validator = require ('validator')
const tamanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
        
    },
    facilities: {
        type: String,
        required: true
       
    },
}) 


module.exports = mongoose.model('Taman', tamanSchema)