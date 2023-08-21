const express = require("express");
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.CONNECTIONSTRING;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
client.connect(err => {
    if(err) {
      console.error("Connection error", err);
      return;
    }
  
    const collection = client.db("UserAuthenticationSystem").collection("Users");
    // perform actions on the collection object
    client.close();
  });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});


app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended:true
}));



app.set('view engine', 'ejs')

// Schema and Data's
var data = []
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: String,
    email: String,
    password: String
  });
const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    for(let i = 0; i < data.length; i++){
        if (data[i]['username'] == username && data[i]['password'] == password) {
                res.render('loginSuccess');
        }
    }
    res.render('loginFailure')
}) 

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.Username,
        email: req.body.Email,
        password: req.body.Password
    });
    
    newUser.save();
    res.render('afterSignUp')
})

app.listen(3010, () => {
    console.log('listening on port 3010!')
})