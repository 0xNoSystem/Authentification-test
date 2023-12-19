//jshint esversion:6
import 'dotenv/config'
import express from 'express'
import bodyParser from "body-parser"
import mongoose from 'mongoose'
import encrypt from 'mongoose-encryption'


try{
    await mongoose.connect('mongodb://127.0.0.1:27017/auth1');
    console.log("Mongoose Set up success")
}catch(e){
    console.log(e.message)
}

const userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password:{type: String, required: true},
    
    createdAt: {type: Date, default: ()=>Date.now()}
})

userSchema.plugin(encrypt, {secret:process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('users',userSchema);

const app = express();
const port = 3000;

let secrets = ['Jack Boaer is my hero.']


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    try{
        res.render('home')
    }catch(error){
        res.send('Failed to render page')
    }
})


app.get('/register', (req,res)=>{

    try{
        res.render('register')
    }catch(err){
        console.log(err.message);
        res.send('Failed to render Page')
    }
})

app.get('/login', (req,res)=>{
    try{
        res.render('login')
    }catch(err){
        console.log(err.message);
        res.send('Failed to render Page')
    }
})

app.get('/submit', async (req,res)=>{
    
    try{
        res.render('submit')
    }catch(err){
        console.log(err.message);
        res.send('Failed to render Page')
    }
    
})

app.get('/logout', (req,res)=>{
    try{
        res.render('home')
    }catch(err){
        console.log(err.message);
        res.send('Failed to render Page')
    }
    
})


app.post('/register', async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    await User.create({username: username, password: password})

    res.redirect('/login')
})


app.post('/login',async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await User.exists({username: username});

    if (userExists){
        const userPass = await User.findOne({username: username}, {'password':1, '_id':0});
        if (password === userPass.password){
            res.render('secrets',{secrets:secrets})
        }else{
            res.redirect('/login')
        }
    }else{
        res.redirect('/login')
    }
    
})

app.post('/submit', async (req, res)=>{
    const userInput = req.body.secret;
    secrets.push(userInput);

    res.render('secrets')
})


app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });


