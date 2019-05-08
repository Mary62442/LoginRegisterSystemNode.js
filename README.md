[![DeepScan grade](https://deepscan.io/api/teams/3675/projects/5408/branches/41455/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=3675&pid=5408&bid=41455)

# Login Register System in Node.js
### A System for registering new users in an SQL Server database, and logging in users already present.


The register function checks if the reCaptcha is successful, if the user exists, hashes the 
password with a salt and stores it in the database, creates a new row in the relational table 
jwtsecrets to store a randomly generated jwt password for each single user, and fires the 
emailuser function which sends a verification email with a link that the user can follow in 
order to verify his/her credentials. 


The login function instead checks if the user already 
exists, if it has been verified via email verification, if the hashed password corresponds with 
the one stored in the database, and sends back a jwt token with the claims.


This system can be seen in action on the [DM88 website](https://diegomary.github.io/#/register)
