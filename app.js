const express = require('express');
const app = express();
require("dotenv").config();
const port = 3004;
var md5 = require('md5')
const mysql = require('mysql'); // Import the MySQL module
const cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
// const DBSOURCE = "usersdb.sqlite";

const auth = require("./middleware");

const db = mysql.createConnection({
    host: 'awwadb.c6gaxuia9dpg.ap-southeast-1.rds.amazonaws.com',
    user: 'admin',
    password: 'g5207196n',
    database: 'usersdb',
    port: 3306
  });
  
  // Connect to the database
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err.message);
      throw err;
    }
    console.log('Connected to MySQL database!');
  });

  process.on('SIGINT', () => {
    db.end((err) => {
      if (err) {
        console.error('Error closing MySQL database connection:', err.message);
      }
      process.exit();
    });
  });

module.exports = db;


app.use(
    express.urlencoded(),
    cors({
        origin: ' http://13.229.232.201:8080'
    })
);

app.get('/', (req, res) => res.send('API Root'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//*  G E T   A L L

app.get("/api/users", (req, res, next) => {
    var sql = "SELECT * FROM Users"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});



app.get("/api/Stories", (req, res, next) => {
    var sql = "SELECT * FROM Stories"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})

//* G E T   S I N G L E   U S E R

app.get("/api/user/:id", (req, res, next) => {
    var sql = "SELECT * FROM Users WHERE Id = ?"
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})
app.get("/api/Stories/:storyid", (req, res, next) => {
    var sql = "SELECT * FROM Stories WHERE storyid = ?"
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})

app.get("/api/Stories/:storyid", (req, res, next) => {
    var sql = "SELECT * FROM Stories WHERE storyid = ?"
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})

app.get("/api/Questions", (req, res, next) => {
    var sql = "SELECT * FROM Questions "
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})
app.get("/api/Questions/:QuestionNofk/:difficulties", (req, res) => {
    var sql = "SELECT * FROM Questions WHERE QuestionNofk = ? AND difficulties = ?"
    db.all(sql, req.params.QuestionNofk,req.params.difficulties, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})
// app.get('/api/Questions/:QuestionNofk/', (req, res) => {
//     const QuestionNofk = req.query.QuestionNofk;
//     const difficulties = req.query.difficulties;
    
//     const sql = 'SELECT * FROM Questions WHERE QuestionNofk = ? ';
    
//     db.all(sql, [QuestionNofk, difficulties], (err, rows) => {
//       if (err) {
//         res.status(400).json({ "error": err.message });
//         return;
//       }
      
//       res.json({
//         "message": "success",
//         "data": rows
//       });
//     });
//   });

app.get("/api/storycontent", (req, res, next) => {
    var sql = "SELECT * FROM Storycontent"
    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})


app.get("/api/storycontent/:storyid", (req, res) => {
    const storyId = req.params.storyid;
    var sql =  `SELECT * FROM Storycontent WHERE storyid = ${storyId}`;

    db.all(sql, req.params.id, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
})

// * R E G I S T E R   N E W   U S E R

// app.post("/api/register", async (req, res) => {
//     var errors = []
//     try {
//         const { Username, Email, Password } = req.body;

//         if (!Username) {
//             errors.push("Username is missing");
//         }
//         if (!Email) {
//             errors.push("Email is missing");
//         }
//         if (errors.length) {
//             res.status(400).json({ "error": errors.join(",") });
//             return;
//         }
//         let userExists = false;


//         var sql = "SELECT * FROM Users WHERE Email = ?"
//         await db.all(sql, Email, (err, result) => {
//             if (err) {
//                 res.status(402).json({ "error": err.message });
//                 return;
//             }

//             if (result.length === 0) {

//                 var salt = bcrypt.genSaltSync(10);

//                 var data = {
//                     Username: Username,
//                     Email: Email,
//                     Password: bcrypt.hashSync(Password, salt),
//                     Salt: salt,
//                     DateCreated: Date('now')
//                 }

//                 var sql = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated) VALUES (?,?,?,?,?)'
//                 var params = [data.Username, data.Email, data.Password, data.Salt, Date('now')]
//                 var user = db.run(sql, params, function (err, innerResult) {
//                     if (err) {
//                         res.status(400).json({ "error": err.message })
//                         return;
//                     }

//                 });
//             }
//             else {
//                 userExists = true;
//                 // res.status(404).send("User Already Exist. Please Login");  
//             }
//         });

//         setTimeout(() => {
//             if (!userExists) {
//                 res.status(201).json("Success");
//             } else {
//                 res.status(201).json("Record already exists. Please login");
//             }
//         }, 500);


//     } catch (err) {
//         console.log(err);
//     }
// })

app.post('/api/useractivity',  (req, res) => {
    const userData = req.body;
    console.log("excuseme?",req.body)
    const user_id = userData.user_id;
    const surveyAnswers = userData.survey_answers;
    
    // Check if a record with the same user_id exists
    const sql = 'SELECT * FROM Useractivity WHERE user_id = ?';
    db3.get(sql, [user_id], (err, existingData) => {
        if (err) {
            console.error('Error querying the database:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (existingData) {
            // A record with the same user_id exists, so update it
            const updateSql = `
                UPDATE Useractivity
                SET survey_answers = ?
                WHERE user_id = ?
            `;
            const params = [
                JSON.stringify(surveyAnswers),
                user_id,
            ];
            db3.run(updateSql, params, (updateErr) => {
                if (updateErr) {
                    console.error('Error updating data in the database:', updateErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log('Data updated successfully');
                    res.status(200).json({ message: 'Data updated successfully' });
                }
            });
        } else {
            // No record with the same user_id exists, so insert a new record
            const insertSql = `
                INSERT INTO Useractivity (user_id, survey_answers)
                VALUES (?, ?)
            `;
            const params = [
                user_id,
                JSON.stringify(surveyAnswers),
            ];
            db3.run(insertSql, params, (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting data into the database:', insertErr);
                    res.status(500).json({ error: 'Internal Server Error' });
                } else {
                    console.log('Data inserted successfully');
                    res.status(200).json({ message: 'Data inserted successfully' });
                }
            });
        }
    });
});

  

// * L O G I N

app.post("/api/login", async (req, res) => {

    try {
        const { Email, Password } = req.body;
        // Make sure there is an Email and Password in the request
        if (!(Email && Password)) {
            res.status(400).send("All input is required");
        }

        let user = [];

        var sql = "SELECT * FROM Users WHERE Email = ?";
        db.all(sql, Email, function (err, rows) {
            console.log("hi1", Password, user)
            if (err) {
                res.status(400).json({ "error": err.message })
                return;
            }

            rows.forEach(function (row) {
                user.push(row);

            })
            console.log("hi", Password, user[0])
            var PHash = bcrypt.hashSync(Password, user[0].Salt);

            if (PHash === user[0].Password) {
                // * CREATE JWT TOKEN
                const token = jwt.sign(
                    { user_id: user[0].Id, username: user[0].Username, Email },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "1h", // 60s = 60 seconds - (60m = 60 minutes, 2h = 2 hours, 2d = 2 days)
                    }
                );

                user[0].Token = token;

            } else {
                return res.status(400).send("No Match");
            }

            return res.status(200).send(user);
        });

    } catch (err) {
        console.log(err);
    }
});

//question


// * T E S T  

app.post("/api/test", auth, (req, res) => {
    res.status(200).send("Token Works - Yay!");
});




app.listen(port, () => console.log(`API listening on port ${port}!`));