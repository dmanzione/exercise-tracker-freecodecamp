const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {SchemaType} = require("mongoose");
const {ObjectId} = require("mongodb");
require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

 mongoose.connect('mongodb+srv://dmanzione:12345-@freecodecamp.plgn94j.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));



let userSchema =  new mongoose.Schema({

    username: String
});

    let workoutSchema = new mongoose.Schema(
        {


            description: {
                type: String,
                required: true

            },
            duration: {
                type: Number,
                required: true
            },
            date: Date
        }



);

    let logsSchema = new mongoose.Schema({
            username:String,
            count:Number,
            log: Array
    }

    );









let User= mongoose.model('User',userSchema);
let LogBook = mongoose.model('LogBook', logsSchema);
let Workout = mongoose.model('Workout',workoutSchema);



app.get('/', (req, res) => {
    // User.remove();
    // LogBook.remove();
    // Workout.remove();
  res.sendFile(__dirname + '/views/index.html')
});


app.get('/api/users',function(req, res){
    let list = [];

    User.find({},function(err, data){
        if(err) return console.log(err)
        else {
res.send(data)
        }
    });




});

app.post('/api/users',function(req, res){
    let sharedId = new ObjectId();
    let newUser = new User({

        _id:sharedId,
        username:req.body.username

    });
    let newLog = new LogBook({

        _id:sharedId,
        username:req.body.username,
        count:0,
        log:new Array()
    })
    newLog.save(function(err, data) {
            if (err) return console.log(err)

        }
    );
    newUser.save(function(err, data) {
        if (err) return console.log(err)
        else
            res.json(newUser);
    })





});

app.get('/api/users/:_id/exercises',function(req, res) {


   LogBook.findById({ _id:req.params._id },function(err, data){

            if(err) return console.log(err);
            if(!data){
                res.json("no such record")
            }


            res.send(data)

        });



});
app.post('/api/users/:_id/exercises',function(req, res) {
    let exercises;

    LogBook.findById({_id:req.params._id},function(err, data){
        if(err) return console.log(data)

        let d;
        if(!req.body.date){
            d = new Date();
        }else{
            d = req.body.date;
        }

        let ex = {
            duration:req.body.duration,
            description:req.body.description,
            date:d

        };

        data.log.push(ex);
        data.count++;
        data.save(function(err, n){
            if(err) return console.log(data)


        })

        ex._id = data._id;
        ex.username = data.username;
        res.json(ex);

    })






});


app.get('/api/users/:_id/logs',function(req, res){


    let logbook = LogBook.findById({_id:req.params._id},function(err,  log){
        if(err) return console.log(err)

            res.json(log)
        });
    })



    // LogBook.updateOne({_id:req.params._id},{log:logbook},function(err,  data){
    //     if(err) return console.log(err)
    //
    // }).then((doc)=>
    //
    // );







//



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
