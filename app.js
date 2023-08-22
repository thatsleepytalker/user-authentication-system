const express = require("express");
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// ENV Variables
const port = process.env.PORT;
const uri = process.env.CONNECTIONSTRING;

// Connection to MongoDB Cloud
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if(err) {
      console.error("Connection error", err);
      return;
    }
    client.close();
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});
// Schema and Data's
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    email: String,
    password: String
  });
const User = mongoose.model('User', userSchema);
// Collection Variable to perform actions on collection
const collection = client.db("UserAuthenticationSystem").collection("users");

// body parser use
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended:true
}));


// view engine set to EJS
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

// Login Page Setup
app.post('/login', async (req,res) => {
    const user = req.body.Username;
    const pass = req.body.Password;
    console.log(user)
    try {
        const check = await collection.findOne({username:user})
        console.log(check)
        if (check.password===pass){
            res.render('loginSuccess')
        }else{
            res.render('loginFailure')
        }
    }catch {
        res.render("loginFailure")
    }
}) 

// Signup Page Render
app.get('/signup', (req,res) => {
    res.render('signup')
})

// Posting new user Signup Page Backend
app.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.Username,
        email: req.body.Email,
        password: req.body.Password
    });
    newUser.save();
    res.render('afterSignUp')
})

// Starting Server, Listening to Port 
app.listen(port, () => {
    console.log(`Listening on Port: ${port}`)
})