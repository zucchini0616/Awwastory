const express = require('express');
const app = express();
require("dotenv").config();
const port = 3000;
var md5 = require('md5')
var sqlite3 = require('sqlite3').verbose()
const cors = require('cors');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const DBSOURCE = "usersdb.sqlite";

const auth = require("./middleware");

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }
    else {
        var salt = bcrypt.genSaltSync(10);

        console.log("where r you 1")
        db.run(`CREATE TABLE Users (
            Id INTEGER PRIMARY KEY AUTOINCREMENT,
            Username text, 
            Email text, 
            Password text,
            Lvl int,
            Profilepic BLOB,             
            Salt text,    
            Token text,
            DateLoggedIn DATE,
            DateCreated DATE
            )`,
            (err) => {
                if (err) {
                    console.log("where r you2")
                    
                    // Table already created
                } else {
                    // Table just created, creating some rows
                    console.log("where r you")
                    var insert = 'INSERT INTO Users (Username, Email, Password,Lvl,Profilepic, Salt, DateCreated) VALUES (?,?,?,?,?,?,?)'
                    db.run(insert, ["user1", "user1@example.com", bcrypt.hashSync("user1password", salt),1,"",salt, Date('now')])
                    db.run(insert, ["user2", "user2@example.com", bcrypt.hashSync("user2password", salt),1,"", salt, Date('now')])
                    db.run(insert, ["user3", "user3@example.com", bcrypt.hashSync("user3password", salt),2,"", salt, Date('now')])
                    db.run(insert, ["user4", "user4@example.com", bcrypt.hashSync("user4password", salt),3,"", salt, Date('now')])
                }
            });}});
let db2 = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }
    else {
      
        db2.run(`
        CREATE TABLE IF NOT EXISTS Stories (
            storyid INTEGER PRIMARY KEY AUTOINCREMENT,
            storyname TEXT,
            storydescription TEXT,
            coverpage BLOB
        )
        `,
            (err) => {
                if (err) {
                    console.log("hihi come here")
                    // Table already created
                } else {
                 
                    
                    
                }
            });
    }
});
let db3 = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        db2.run(`
        CREATE TABLE IF NOT EXISTS Questions (
            Questionid INTEGER PRIMARY KEY AUTOINCREMENT,
            QuestionNofk INTEGER,
            question TEXT,
            answer TEXT,
            difficulties INTEGER,
            FOREIGN KEY (QuestionNofk) REFERENCES Storycontent(questionid)
        )
    `,
    (err) => {
        if (err) {
            console.log("Error creating Questions table:", err.message);
        } else {
     
        }
    });
    }
});

let db4 = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        db4.run(`
            CREATE TABLE IF NOT EXISTS Storycontent (
                pageid INTEGER PRIMARY KEY AUTOINCREMENT,
                storyid INTEGER,                
                content BLOB,
                contenttxt TEXT,
                questionid INTEGER,
                FOREIGN KEY (storyid) REFERENCES Stories(storyid)
                FOREIGN KEY (questionid) REFERENCES Questions(questionid)
                
            )
        `,
        (err) => {
            if (err) {
                console.log("Error creating Storycontent table:", err.message);
            } else {

                
            }
        });
    }
});



module.exports = db;
module.exports = db2;
module.exports = db3;
module.exports = db4;



app.get('/', (req, res) => res.send('API Root'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
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
app.get("/api/useractivity", (req, res) => {
    var sql = "SELECT * FROM Useractivity"

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
app.get("/api/useractivity/:user_id/:storyId", (req, res) => {
    var sql = "SELECT * FROM Useractivity WHERE user_id = ? and story_id = ?"

    db.all(sql, req.params.user_id,req.params.storyId, (err, rows) => {
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


app.post('/api/useractivity',  (req, res) => {
    const userData = req.body;
    console.log("excuseme?",req.body)
    const user_id = userData.user_id;
    const story_id = userData.storyId;
    const surveyAnswers = userData.survey_answers;
    
    // Check if a record with the same user_id exists
    const sql = 'SELECT * FROM Useractivity WHERE user_id = ? AND story_id = ?';
    db3.get(sql, [user_id], [story_id],(err, existingData) => {
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
                WHERE user_id = ? AND story_id = ?
            `;
            const params = [
                JSON.stringify(surveyAnswers),
                user_id,story_id
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
                INSERT INTO Useractivity (user_id, story_id,survey_answers)
                VALUES (?, ?,?)
            `;
            const params = [
                user_id,story_id,
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