const sqlconn = require("mssql");
const jwt = require('jsonwebtoken');

const config = require('./configdb');

var loginwithtoken = function(token) {

    return new Promise((resolve,reject)=> {

        let claim = jwt.decode(token);
        if (claim === null) {
            sqlconn.close();
            return reject({success:false});
        }
        sqlconn.connect(config, (err) => {
            if (err) return reject(err); 

            let finduser = new sqlconn.Request();
            finduser.query(`SELECT jwtsecret FROM jwtsecrets WHERE userId = 
            (SELECT userId FROM users WHERE userEmail = '${claim.email}')`,
            (err,res)=>{
                if (err) {
                    sqlconn.close();
                    return reject({success:false});
                }

                jwt.verify(token, res.recordset['0'].jwtsecret, (err,decoded) => {
                    if (err) {
                        sqlconn.close();
                        return reject({success:false});
                    }
                    sqlconn.close();
                    return resolve({success:true, claim: claim, message: 'User logged with token'});

                })
            })
        })
    })
}

module.exports = loginwithtoken;