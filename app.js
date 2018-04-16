'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
let fs = require('fs');
let path = require('path');

var register = require('./register');
var login = require('./login');
var loginwithtoken = require('./loginwithtoken');
var verifyuser = require('./verifyuser');
var checkusernameemail = require('./checkusernameemail');


let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Custom-Auth-Step1, Custom-Auth-Step2, Custom-Auth-Step3, Custom-Auth-Step4');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {res.sendStatus(200); }
    else { next(); }
}

app.use(allowCrossDomain);
app.use(express.static('public'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register',  (req, res, next) => { 
    let body = req.body;

    let username = body.username;
    let userfirstname = body.userfirstname;
    let userlastname = body.userlastname;
    let useremail = body.useremail;
    let userpassword = body.userpassword; 
    let useraddress1 = body.useraddress1;
    let useraddress2 = body.useraddress2;
    let usercity = body.usercity;
    let userpostalcode = body.userpostalcode;
    let usercountry = body.usercountry;
    let recaptcha = body.recaptcha;
    let clientIp =  req.connection.remoteAddress;
    
    register(username, userfirstname, userlastname, useremail, userpassword, useraddress1, useraddress2,
    usercity, userpostalcode, usercountry, recaptcha, clientIp)
        .then(
        (data) => {                       
            res.send(data);            
        })
        .catch((error) => {res.send(error)});
});

app.post('/login', (req,res) => {
    let body = req.body;
    let usernameemail = body.usernameemail;
    let userpassword = body.userpassword;

    login(usernameemail, userpassword)
    .then((data)=> {      
        res.send(data);
    })
    .catch((err) => {
        res.send(err);
    })
})

app.post('/checkusernameemail', (req,res) => {
    let body = req.body;
    let usernameemail = body.usernameemail;
    checkusernameemail(usernameemail)
    .then((data => {
        res.send(data)
    }))
    .catch((err) => {
        res.send(err);
    })
})

app.post('/loginwithtoken', (req,res) => {
    let body = req.body;
    let token = body.token;

    loginwithtoken(token)
    .then((data)=> {      
        res.send(data);
    })
    .catch((err) => {
        res.send(err);
    })
});


app.get('/verifyuser', (req,res) => {
    let user = req.query.user;
    verifyuser(user)
    .then((success) => {
        res.redirect('/emailverified.html');
    })
    .catch((err) => {
        res.redirect('/emailnotverified.html');
    })
});


server.listen(process.env.PORT || 8000, () => {
        console.log(`Application worker ${process.pid} started...`);
});
