const mongoose = require('mongoose')


const bookSchema = new mongoose.Schema({
    userName : {
        type:String,
        required:true
    },
    busName:{
        type:String,
        required:true
    },
    bookSeat:{
        type:String,
        required:true
    }
})

const userDetails = mongoose.model("User",bookSchema)

module.exports = userDetails
