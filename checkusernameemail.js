const sqlconn = require("mssql");
const config = require('./configdb');

var checkusernameemail = function(usernameemail) {

    return new Promise((resolve,reject)=> {        

        sqlconn.connect(config, (err) => {
            if (err) {
                sqlconn.close();
                return reject(err); 
            }
            let checkusernameemail = new sqlconn.Request();
            checkusernameemail.query(`SELECT * FROM users WHERE userName = '${usernameemail}' OR userEmail = '${usernameemail}'`, (err,res) => {
                sqlconn.close();
                if (err) return reject(err)

                else if(res.recordset.length === 0) return resolve({userExists:false})

                else return resolve({userExists:true})

            });
        });
    });
};

module.exports = checkusernameemail;