const { urlencoded } = require('body-parser');
const express = require('express');
const app= express();
const path= require('path');
const userModel= require('./connection').userModel;
const tweetModel= require('./connection').tweetModel;
const cookieParser=require('cookie-parser');

app.use(express.json(urlencoded));
app.use(cookieParser())

app.get('/register',(req,res)=>{

    res.sendFile('views/register.html',{ root: __dirname })

})

app.post('/register',(req,res)=>{
     
    console.log(JSON.parse(req.headers.body));
    userModel.insertMany(JSON.parse(req.headers.body)).then(()=>{
      
            res.send('registration successfull')
        
       
    }).catch(()=>{
        res.send("Registration failed...Please try Again later")
    })
    // res.send('logged In')

   

})

app.get('/login',(req,res)=>{
    res.sendFile('views/login.html',{ root: __dirname })
})
app.post('/login',(req,res)=>{
    let input=JSON.parse(req.headers.body)
    userModel.findOne({userid:input.userId,password:input.password}).then(_=>{
        console.log(_,'s');
        if(_.userid && _.password){
            res.cookie("userid",_.userid)
            res.send("Logged In")
        }else{
            res.send("invalid credentials")
        }
    }).catch(err=>{
        res.send('invalid credentials')
    })
})

app.get('/viewpage',auth,(req,res)=>{
    console.log(req.cookies);
    res.sendFile('views/tweet.html',{ root: __dirname })
})

app.post('/addtweet',(req,res)=>{
    let count=0;
    console.log(req.headers.body,req.cookies);
    tweetModel.find({userId:req.cookies.userid}).then(_=>{
        count= _.length
        tweetModel.insertMany({userId:req.cookies.userid,tweet:req.headers.body,id:count+1}).then(_=>{
            res.send("tweet posted successfully")
        }).catch(err=>{
            res.send('tweet post failed')
        }
        )
      }).catch(err=>{
        res.send('tweet post failed')
      })
  
//     res.sendFile('views/tweet.html',{ root: __dirname })
 })

 app.get('/viewtweets',(req,res)=>{
    res.sendFile('views/list.html',{ root: __dirname })
 })

 app.get('/gettweets',(req,res)=>{
  tweetModel.find({userId:req.cookies.userid}).then(_=>{
    console.log(_);
    if(_.length==0){
        res.send('No Tweets available for this userid')
    }else{
        res.send(_)
    }
  }).catch(err=>{
    console.log(err);
  })
 })

 app.delete('/deletetweet/:userid/:tweetid',()=>{

   tweetModel.deleteOne({userId:req.params.userid,id:req.params.tweetid}).then(_=>{
    res.send('DeleteOperation sucess',_)
   }).catch(err=>{
    res.send('some error occured')
   })

 })

app.get('/',(req,res)=>{

    res.redirect('/register')

})


function auth(req,res,next){
    if(req.cookies.userid){
       next()
    }else{
        res.redirect('/login')
    }
}

app.listen(5500,()=>{
    console.log('server is running at 5500');
})