const express = require("express");
const path = require('path');
const ejs = require('ejs');

const app = express()

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req,res) => {
    res.send(req.query)
}) 

app.get('/signup', (req,res) => {
    res.render('signup')
})

app.listen(3010, () => {
    console.log('listening on port 3010!')
})