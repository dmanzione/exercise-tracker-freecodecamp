const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {ObjectId} = require("mongodb");
require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

let db = mongoose.connect('mongodb+srv://dmanzione:12345-@freecodecamp.plgn94j.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
let userSchema = new mongoose.Schema(
    {
        username:String
    }

);
let exerciseSchema = new mongoose.Schema(

    {
        _id:{
          unique:false,
            type:String

        },
        username:String,

      description: {
          type: String,
          required:true

      },
        duration: {
          type: Number,
            required: true
        },
        date: {
          type: Date,
            required: true
        }
    }


);


let Exercise = mongoose.model('Exercise',exerciseSchema);



let logSchema =new mongoose.Schema({
    _id:{
        type:String,
        unique:false
    },
    username:{
        type:String
    },
    "count":Number,
    "log":Array
});

let Logs = mongoose.model('Logs',logSchema);

let User = mongoose.model('User',userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users',function(req, res){
    let myUser = new User({
        username:req.body.username
    });

     myUser.save(function(err, data){
        if(err) return console.log(err);

         res.json(data);

    });

})
app.post('/api/users/:_id/exercises',function(req, res) {

    let u = User.findById(req.params._id, function (err, data) {
        if (err || !data) return console.log(err)
        else {
            let usr = data.username;
            let myExercise = new Exercise(
                {
                    _id: req.params._id,
                    username: data.username,
                    duration: req.body.duration,
                    description: req.body.description,
                    date: new Date(req.body.date).toDateString()

                });
            let l = Logs.findById(req.params._id, function (err, logdata) {
                if (err) return console.log(err)
                let ll;
                if (!logdata) {
                    ll = new Logs({
                        _id: req.params._id,
                        username: usr,
                        count: 1,
                        log: [myExercise]
                    })

                }else {
                    ll = logdata;
                    ll.log.push(myExercise);

                }
                ll.save(function (err, d) {
                    if (err) return console.log(err)


                });

            })


            myExercise.save(function (err, data) {
                if (err) return console.log(data);
                else {

                    res.json(myExercise);
                }

            });


        }
    }
    );
});

app.get('/api/users/:_id/logs',function(req, res){
    Logs.findOne({_id:req.params._id},function(err,  data){
        if(err) return console.log(err)
        else
            res.json(data.log);
    });


});




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
