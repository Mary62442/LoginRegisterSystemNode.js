const sqlconn = require("mssql");

const config = require('./configdb');

var verifyuser = function(userid) {

    return new Promise((resolve,reject)=> {        

        sqlconn.connect(config, (err) => {
            if (err) {
                sqlconn.close();
                return reject(err); 
            }
            let verifyuser = new sqlconn.Request();
            verifyuser.query(`UPDATE users SET userIsVerified = '1' WHERE userId = '${userid}'`, (err,res) => {
                sqlconn.close();
                if (err)  return reject({success:false});                
                return resolve({success:true});
            })
        })
    
    })        
}

module.exports = verifyuser;