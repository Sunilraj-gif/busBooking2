const mongoose = require('mongoose')


const bookSchema = new mongoose.Schema({
    busName:{
        type:String,
        required:true
    },
    route:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    seat:{
        type:Number,
        require:true
    },
    image:{
        type:String,
        required:true
    }
})

const bookBus = mongoose.model("Bus",bookSchema)

module.exports = bookBus
