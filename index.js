const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {SchemaType} = require("mongoose");
const {ObjectId, MongoClient} = require("mongodb");

require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

let db = mongoose.connect('mongodb+srv://dmanzione:12345-@freecodecamp.plgn94j.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));



let userSchema =  new mongoose.Schema({

    username: String,
    date:{
        expose:false,
        type:Date
    },
    description:{
        expose:false,
        type:String
    },
    duration:{
        expose:false,
        type:Number
    }

});

    let workoutSchema = new mongoose.Schema(
        {

            username:String,
            description: {
                type: String,
                required: true

            },
            duration: {
                type: Number,
                required: true
            },
            date:String
        }



);

    let logsSchema = new mongoose.Schema({
            username:String,
            count:Number,
            log: []
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

app.get('/clean', (req, res) => {
    User.remove(function(err, data){

    });
    LogBook.remove(function(err, data){

    });
    Workout.remove(function(err, data){

    });

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
    let usrnme = req.body.username;
    let newUser = new User({

        _id:sharedId,
        username:usrnme

    });
    let newLog = new LogBook({

        _id:sharedId,
        username:usrnme,
        count:0,
        log:[]
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

          let exercises = new Array();
            let arr = data.log;
            console.log(typeof arr)
           for(let x of arr){
                let obj = {_id:data._id,username:data.username,description:x.description, duration: parseInt(x.duration), date: x.date};
               exercises.push(obj);

             }

            res.send(exercises);



        });



});
app.post('/api/users/:_id/exercises',function(req, res) {
    let exercises;

    User.findById({_id: req.params._id}, function (err, data) {
        if(err) return console.log(err)





        LogBook.findById({_id:data._id},function(err, u){
            if (err) return console.log(err)

            let d;
            if (!req.body.date) {
                d = new Date();
                d = d.toDateString();
            } else {
                d = req.body.date;
                d = new Date(d).toDateString();
            }
            let ex = new Workout({
                username: data.username,
                date: d,
                description: req.body.description,
                duration: parseInt(req.body.duration)

            });


            u.log.push(ex);
            u.count++;

            u.save(function (err, n) {
                if (err) return console.log(err)
            });



                data.duration= parseInt(req.body.duration);
                data.description= req.body.description;
                data.date=d;

                data.save(function(e, d2){
                    if(e)return console.log(e)

                    res.send(d2);

                })


            })

        })




});













app.get('/api/users/:_id/logs',function(req, res){


    let logbook = LogBook.findById({_id:req.params._id},function(err,  log) {
        if (err) return console.log(err)



        let exercises=[];

        let count = 0;
            for (let i = 0; i<log.log.length;i++) {
                console.log(count)
                if ( new Date(log.log[i].date).valueOf()< new Date(req.query.from).valueOf()){
                    continue;
                }
                if(new Date(log.log[i].date).valueOf() > new Date(req.query.to).valueOf()){
                    continue;
                }
                if(count >= parseInt(req.query.limit)) {


                    continue;
                }
                    count++;
                    exercises.push(log.log[i])


            }


            log.log = exercises;
            res.json(log);
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
