const express = require('express')
const home = require('./routes/home')
const mongodb = require('./DB/mongodb')
const bodyParser = require('body-parser')
const app = express()

app.use(express.static('uploads'))

app.set('view engine','ejs')
app.use(express.static('public'))

app.use(express.urlencoded({extended:true}))

app.use(bodyParser.json())

app.use(home)

app.get('/',(req,res)=>{
    res.send("Home Page")
})

app.listen(8000,()=>{
    console.log("This is connected to port 8000")
})