const sqlconn = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('./configdb');

var login = function(usernameemail, userpassword) {

    return new Promise((resolve,reject)=> {

        sqlconn.connect(config, (err) => {
            if (err) {
                sqlconn.close();
                return reject({success:false, message:'Invalid credentials'});
            }

            let finduser = new sqlconn.Request();
            finduser.query(`SELECT * FROM users WHERE userName = '${usernameemail}' OR userEmail = '${usernameemail}'`, (err,res) => {
                if (err) {
                    sqlconn.close();
                    return reject({success:false, message:'Invalid credentials'});
                }
                if (res.recordset.length === 0) {
                    sqlconn.close();
                    return reject({success:false, message:'Invalid credentials'});
                }              

                let user = res.recordset['0'];

                if (!user.userIsVerified) {
                    sqlconn.close();
                    return reject({success:false, message:'Invalid credentials'});
                }
                
                let salt = user.userPasswordSalt;
                let hash = bcrypt.hashSync(userpassword, salt);  

                if (hash === user.userPassword) {
                    let findjwtsecret = new sqlconn.Request();
                    findjwtsecret.query(`SELECT jwtsecret FROM jwtsecrets WHERE userId = '${user.userId}'`, (err,res) => {
                        sqlconn.close();
                        if (err) return reject({success:false, message:'Invalid credentials'});                        
                        let claim = {firstName: user.userFirstName, lastName: user.userLastName, email:user.userEmail};
                        let token = jwt.sign(claim, res.recordset['0'].jwtsecret, {
                            expiresIn: "2 days"
                        });
                        return resolve({success:true, message:'User logged in', token: token, claim: claim})
                    })
                }
                else {
                    sqlconn.close();
                    return reject({success:false, message:'Invalid credentials'}); 
                }
            });
        });
    });
};

module.exports = login;