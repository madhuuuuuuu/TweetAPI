const mongoose= require('mongoose');
const Schema= mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/tweetdb').then(_=>{
    console.log('db connected');
}).catch(_=>{
    console.log('no db connected');
})

const userSchema= new Schema({
    firstname:String,
    lastname:String,
    email:String,
    userid:String,
    password:String
})

const tweetSchema= new Schema({
    id:String,
    tweet:String,
    userId:String
})


exports.userModel= mongoose.model('user',userSchema,"users");
exports.tweetModel= mongoose.model('tweet',tweetSchema,"tweets");