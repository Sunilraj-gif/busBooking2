const express = require('express')
const BOOKBUS = require('../models/busModel')
const USERMODEL = require('../models/userModel')
const router = express.Router()
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, './uploads')
    },
    filename: function(req,file,cb){
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
})

var upload = multer({
    storage:storage
}).single('image')


router.post('/add',upload,(req,res)=>{

    const busSchema = new BOOKBUS({        
        busName : req.body.busName,                           
        route: req.body.route,                            
        time: req.body.time,                            
        price: req.body.price,                            
        seat: req.body.seat,
        image : req.file.filename,
    })
     busSchema.save().then((data=>{
        res.redirect('/')
    }))
})

router.get('/index.ejs',(req,res)=>{
    res.render('index.ejs')
})

router.get('/bus',(req,res)=>{
    BOOKBUS.find().then((data)=>{
        res.render('bus',{busData:data})
    })
})

router.get('/book/:id',(req,res)=>{

    const bus = req.params.id
     BOOKBUS.find({busName:bus}).then((data)=>{
        console.log(data)
        res.render('bus2',{busInfo:data})
    })
})

router.post('/book',async(req,res)=>{
    const bus = req.body.busName;
    let seats = 0;
    let id = 0;
    const bookedSeat = req.body.bookSeat;
   await BOOKBUS.find({busName:bus}).then((data)=>{
        data.forEach((seat)=>{
             seats = parseInt(seat.seat)
             id = seat._id
        })
    })
    const finalSeat = seats - parseInt(bookedSeat)
    const result  = await BOOKBUS.updateMany({_id:id},{
        $set:{
            seat : finalSeat.toString()
        }
    })
    const userSchema = new USERMODEL({
        userName : req.body.userName,
        busName : req.body.busName,
        bookSeat : req.body.bookSeat
    })
    userSchema.save().then((data)=>{
        res.redirect('/')
    })
})

router.post('/search',(req,res)=>{
    const route = req.body.route
    const route2 = req.body.route1
    var data = route + " to " + route2
    BOOKBUS.find({
        route:data
    }).then((data)=>{
        res.render('bus',{busData:data})
    })
})



router.get('/',(req,res)=>{
    res.render('home')
})


module.exports = router