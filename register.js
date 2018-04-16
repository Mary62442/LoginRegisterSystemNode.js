var sqlconn = require('mssql');
var bcrypt = require('bcrypt');
var randomstring = require('randomstring');
var request = require('request');

var config = require('./configdb');
var emailUser = require('./emailuser');

var saltRounds = 12;

var register =  function(username, userfirstname, userlastname, useremail,
userpassword, useraddress1, useraddress2, usercity,
userpostalcode, usercountry, recaptcha, clientIp) {
    
    return new Promise( (resolve, reject) => {

        request.post({
        url:"https://www.google.com/recaptcha/api/siteverify",
		form: {
            secret:"",
			response :recaptcha,
            remoteip:clientIp
        }}, (err,httpResponse,body)=>{

            if(err)  return reject({success:false, message:'Could not register user'});            
            let success = (JSON.parse(body)).success; 
            if (!success) return reject({success:false, message:'Could not register user'});

            sqlconn.connect(config, (err) => {
                if (err) {
                    sqlconn.close();
                    return reject({success:false, message:'Could not register user'});
                }

                let checkUser = new sqlconn.Request();
                checkUser.query(`SELECT * FROM users WHERE userEmail = '${useremail}' OR userName = '${username}'`, (err,res)=> {
                    let result = res.recordset.length;

                    if (result !== 0) {
                        sqlconn.close();
                        return reject({success:false, message:'User already exists'});
                    }

                    bcrypt.genSalt(saltRounds, (err, salt) => {
                        let asyncSalt = salt;                 
                        bcrypt.hash(userpassword, salt)                
                        .then((hash) => {
                            let createUser = new sqlconn.Request();
                            
                            createUser.query(`INSERT INTO users (userName, userFirstName, userLastName, userEmail, userPassword, userPasswordSalt,
                            userAddress1, userAddress2, userCity, userPostalCode, userCountry, userIsVerified, userIsAdmin)
                            VALUES ('${username}','${userfirstname}', '${userlastname}', '${useremail}','${hash}', '${asyncSalt}', '${useraddress1}',
                            '${useraddress2}', '${usercity}', '${userpostalcode}', '${usercountry}', '0', '0')`, (err, result) => {                    
                                if (err) {
                                    sqlconn.close();
                                    return reject({success:false, message:'Could not register user'});
                                }

                                let secretJwt = randomstring.generate(12);

                                let createSecret = new sqlconn.Request();
                                createSecret.query(`INSERT INTO jwtsecrets (userId, jwtsecret)
                                VALUES ((SELECT userId FROM users WHERE userName = '${username}'), '${secretJwt}')`, (err,res) => {
                                    if(err) {
                                        sqlconn.close();
                                        return reject({success:false, message:'Could not register user'});
                                    }
                                    let findUserId = new sqlconn.Request();
                                    findUserId.query(`SELECT userId FROM users WHERE userName = '${username}'`, (err,res) => {
                                        sqlconn.close();

                                        if(err) return reject({success:false, message:'Could not register user'});                                     
                                        
                                        let useridtosend = res.recordsets['0']['0'].userId;
                                        emailUser(useremail, useridtosend);                                            
                                        return resolve({success:true, message:'User created and email sent'});                                        
                                    });
                                }); 
                            }); 
                        });
                    });
                });
            });
        });
    });
};

module.exports = register;
