const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { SchemaType } = require("mongoose");
const { ObjectId } = require('mongodb');

require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

let db = mongoose.connect('mongodb+srv://dmanzione:12345-@freecodecamp.plgn94j.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));

const opts = { toJSON: { virtuals: true } };




let userSchema = new mongoose.Schema({
    
    username: String,
    count: Number,
    log: [
        new mongoose.Schema({
            date: String,
            description: String,
            duration: Number
        }, { _id: false, versionKey :false })]})


userSchema.virtual('me')
    .get(function () {

        return {
            _id: this._id,
            username: this.username
           
        };
    })

userSchema.virtual('workout')
    .get(function () {
        let usernameObj = {username:this.username};

        let storedW =this.log[this.log.length-1];
        let copy = {};

        copy.date = storedW.date;
        copy.description = storedW.description;copy.description = storedW.description;
        copy.duration =storedW.duration;

        let idObj = {_id:this._id};

      return Object.assign(usernameObj, copy,idObj);
       
      })
  ;
       

 





    const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {

    res.sendFile(__dirname + '/views/index.html')
});

app.get('/clean', (req, res) => {
    User.remove(function (err, data) {
        if (err) return console.log(err)
    });

   

});
app.get('/api/users', function (req, res) {


    User.find().then(u => {

       let usrs= u.map(x => x.me);
        res.json(usrs)
    })
        .catch(error => {
            console.log(error);
        });




});

app.post('/api/users', function (req, res) {


    new User({

       
        username: req.body.username,
        count: 0,
        log: new Array()

    }).save().then(x => {
        res.json(x.me)
    }).catch(error => {
        console.log(error);
    })


});

app.get('/api/users/:_id/logs', function (req, res) {


    User.findById({ _id: ObjectId(req.params._id)}, function (err, data) {

       
        res.json(data);



    });



});
app.post('/api/users/:_id/exercises', function (req, res) {
    
  
    
    let usr = User.findByIdAndUpdate({_id:ObjectId(req.params._id)},{$push:{log:{ date: new Date(req.body.date).toDateString(),
        description: req.body.description,
        duration: parseInt(req.body.duration)}}},function(err,data){
        
       if(err) return console.log(err)
        
        
       
    
    }).then(x=>res.json(x.workout))

})


   

























app.get('/api/users/:_id/logs', function (req, res) {


    let logbook = User.findById({ _id: ObjectId(req.params._id) }, function (err, log) {
        if (err) return console.log(err)



        let exercises = [];

        let c = 0;

        
        for (let i = 0; i < log.log.length; i++) {
            
            if (new Date(log.log[i].date).valueOf() < new Date(req.query.from).valueOf()) {
                continue;
            }
            if (new Date(log.log[i].date).valueOf() > new Date(req.query.to).valueOf()) {
                continue;
            }
            if (c >= parseInt(req.query.limit)) {


                continue;
            }
            c++;

            exercises.push(log.log[i])


        }


        log.log = exercises;
        log.count = exercises.length;
        res.json(log);
    });
})



// LogBook.updateOne({_id:ObjectId(req.params._id)},{log:logbook},function(err,  data){
//     if(err) return console.log(err)
//
// }).then((doc)=>
//
// );







//



const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
