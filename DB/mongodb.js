const mongoose = require('mongoose')


mongoose.connect("mongodb+srv://karthickec20:h2tL2UA71El3lOC4@cluster0.wxcmvpy.mongodb.net/?retryWrites=true&w=majority",{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("Connected")
})

module.exports = mongoose
