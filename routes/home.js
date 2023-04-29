const express = require('express')
const BOOKBUS = require('../models/busModel')
const USERMODEL = require('../models/userModel')
const router = express.Router()
const multer = require('multer')
const nodemailer = require('nodemailer')

//Image storage
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

//send mail details
var sender = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'busbookinb@gmail.com',
        pass :'xbtriseikafouzza'
    }
})


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

router.get('/:id',(req,res)=>{

    const bus = req.params.id
     BOOKBUS.find({busName:bus}).then((data)=>{
        res.render('bus2',{busInfo:data})
    })
})

router.post('/book',async(req,res)=>{
    const bus = req.body.busName;
    let seats = 0;
    let id = 0;
    let busName = null;
    let route = null;
    let price = null;
    const bookedSeat = req.body.bookSeat;
   await BOOKBUS.find({busName:bus}).then((data)=>{
        data.forEach((seat)=>{
            busName = seat.busName
            route = seat.route
            price = seat.price
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
        Email : req.body.Email,
        phoneNumber: req.body.phoneNumber,
        busName : req.body.busName,
        bookSeat : req.body.bookSeat
    })
    userSchema.save().then((data)=>{
        var composemail = {
            from : 'busbookinb@gmail.com',
            to : req.body.Email,
            subject : 'Bus Booking Ticket Details',
            html : `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                .center {
                    display: block;
                    margin-left: auto;
                    margin-right: auto;
                    width:30px;
                    size: 20px;
                }
                .success{
                    color: blue;
                    text-align: center;
                    font-size: 20px;
                    font-style: italic;
                }
                .msg{
                    text-align: center;
                }
                .label{
                    color: grey;
                    font-size: 13px;
                }
                .details{
                    font-size: 20px;
                }
                .bus-details{
                    display: flex;
                    justify-content:space-evenly;
                    padding-left: 10px;
                    padding-right: 10px;
                    padding-top: 10px;
                }
                .ticket-details{
                    display: flex; justify-content: space-around;
                }
                </style>
                </head>
            
                <body>
                    <div style="width: 100%; border: 1px solid black;">
                    <div>
                        <img style="padding-top: 5px;" class="center" src="https://img.freepik.com/free-icon/bluepay_318-627089.jpg" >
                        <p class="success"><strong>Congratulation!</strong>, You have Successfully booked a ticket</p>
                        <p class="msg">Please, carry a ticket along with relevent photo ID for travelling </p>
                    </div>
                
                    <div style="text-align: center;">
                        <img class="center" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Logo_Blue_Bus.svg/1200px-Logo_Blue_Bus.svg.png" >
                        <strong style="color: blue;font-size: 20px;">Bus Details</strong>
                        <div>
                            <label class="label" for="busName"><strong>BusName</strong></label>
                        <p style="font-size: 17px;margin-top: -3px;" class="details">${busName}</p>
                        </div>
            
                        <div>
                            <label class="label" for="Route"><strong>Route</strong></label>
                        <p style="font-size: 17px;margin-top: -3px;" class="details">${route}</p>
                        </div>
            
                        <div>
                            <label class="label" for="Seat"><strong>Seat</strong></label>
                        <p style="font-size: 17px;margin-top: -3px;" class="details">${req.body.bookSeat}</p>
                        </div>
            
                        <div>
                            <label class="label" for="Class"><strong>Class</strong></label>
                        <p style="font-size: 17px;margin-top: -3px;" class="details">Sleeper (SL)</p>
                        </div>
            
                        <div>
                            <label class="label" for="Quota"><strong>Price</strong></label>
                        <p style="font-size: 17px;margin-top: -3px;" class="details">RS : ${price}</p>
                        </div>
                    </div>
                    <hr style="width:50%">
                    <div style="text-align: center;">
                        <img class="center" src="https://cdn-icons-png.flaticon.com/512/5087/5087607.png" >
                        <strong style="color: blue;font-size: 20px;">Customer Details</strong>
            
                        <div style="padding-top: 20px;">
                            <div>
                                <label class="label" for="CustomerName"><strong>CustomerName</strong></label>
                            <p style="font-size: 17px;margin-top: -3px;" class="details">${data.userName}</p>
                            </div>
                
                            <div>
                                <label class="label" for="Email"><strong>Email</strong></label>
                            <p style="font-size: 17px;margin-top: -3px;" class="details">${data.Email}</p>
                            </div>
                
                            <div>
                                <label class="label" for="PhoneNumber"><strong>PhoneNumber</strong></label>
                            <p style="font-size: 17px;margin-top: -3px;" class="details">${data.phoneNumber}</p>
                            </div>
                        </div>
                        <hr style="width:50%">
                    </div>
                </div>
            </body>
            </html>`
        }
        sender.sendMail(composemail, function(error,info){
            if(error){
                console.log(error)
            }
            else{
                console.log("Mail Send Successfully")
            }
        })
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