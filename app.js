const express = require("express");
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended:true
}));

app.set('view engine', 'ejs')

var data = []

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
    data.push(req.body)
    console.log(data)
    res.render('afterSignUp')
})

app.listen(3010, () => {
    console.log('listening on port 3010!')
})