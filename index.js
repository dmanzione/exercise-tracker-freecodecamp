const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {SchemaType} = require("mongoose");
const {ObjectId, MongoClient, ObjectID} = require("mongodb");
const $parent = require("mongodb/lib/operations/add_user");

require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

let db = mongoose.connect('mongodb+srv://dmanzione:12345-@freecodecamp.plgn94j.mongodb.net/?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));






let userSchema = new mongoose.Schema(

        {


            username: {
                type: String,
            },
            log:[]


        }




);


let User = mongoose.model('User',userSchema);


app.get('/', (req, res) => {

  res.sendFile(__dirname + '/views/index.html')
});

app.get('/clean', (req, res) => {

    User.remove(function(err, data){

    });


});
app.get('/api/users',function(req, res){


    User.find({},function(err, usrs) {
        if (err) return console.log(err)
        if(!usrs){
            res.json({info:'empty'})
        }
        res.json(usrs);
    });





});

app.post('/api/users',function(req, res){


      let user =  new User({

          username:req.body.username

      }).save((err,u)=>{
          res.json({_id: u._id, username:u.username})
    });

});


app.post('/api/users/:_id/exercises',function(req, res) {


        User.findById({_id: req.params._id}, function (err,u) {
            if (err) return console.log(err)
            if(!u){
                res.json({error:'no such user in record'})
            }
            if (err) res.json({error: 'no such record'});


            u.log.push({ date: new Date(req.body.date).toDateString(),
                description: req.body.description,
                duration:parseInt(req.body.duration)});

            u.save(function (err, updatedLog) {

        if (err) return console.log(err)

                res.json({_id:u._id, username:u.username,date: new Date(req.body.date).toDateString(),  description: req.body.description, duration:parseInt(req.body.duration)});
    });



        });

    } );














app.get('/api/users/:_id/logs',function(req, res) {

    User.findById({_id:req.params._id},function(err,  usr) {
        if(err) return console.log(err)
        if(!usr){
            res.json({error:'no such user in record'})
        }
        let arr = [];
        if (req.query.properties) {

            for (let i = 0; i < usr.log.length; i++) {
                if ( new Date(usr.log[i].date).valueOf() < new Date(req.query.from).valueOf()
                ) {
                    continue;
                }
                if ( new Date(usr.log[i].date).valueOf() > new Date(req.query.to).valueOf()) {
                    continue;
                }
                if ( count >= parseInt(req.query.limit)) {


                    continue;
                }

                arr.push({_id:usr._id,username:usr.username,count:arr.length,log:arr})
                count++;
            }

        } else {
            res.json({_id:usr._id,username:usr.username,count:usr.log.length,log:usr.log});
        }


    });

});



    // LogBook.updateOne({_id:req.params._id},{log:logbook},function(err,  data){
    //     if(err) return console.log(err)
    //
    // }).then((doc)=>
    //
    // );







//



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
