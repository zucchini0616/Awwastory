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
const path = require('path');



const auth = require("./middleware");


// function adminAuth(req, res, next) {
//   const authHeader = req.headers.authorization || '';            // e.g. "Bearer xxxx"
//   const token      = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ error: 'Admin token required' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.TOKEN_KEY);
//     if (decoded.username !== 'awwastoryadmin') {
//       return res.status(403).json({ error: 'Forbidden: admin only' });
//     }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: 'Invalid admin token' });
//   }
// }

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    }
    else {
        var salt = bcrypt.genSaltSync(10);

     
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
                
                    
                    // Table already created
                } else {
                    // Table just created, creating some rows
                 
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

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
  
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }
  
    // Generate a random salt
    const salt = bcrypt.genSaltSync(10);
  
    // Hash the user's password using the generated salt
    const hashedPassword = bcrypt.hashSync(password, salt);
  
    // Set default values for profile picture and level
    const defaultProfilePic = 'images/profile-icon.png';
    const defaultLevel = 1;
  
    const sql = 'INSERT INTO Users (Username, Email, Password, Salt, DateCreated, ProfilePic, Lvl) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const params = [username, email, hashedPassword, salt, new Date().toISOString(), defaultProfilePic, defaultLevel];
  
    db.run(sql, params, function (err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      res.json({
        message: 'User registered successfully',
        data: {
          id: this.lastID,
          username: username,
          email: email,
          profilePic: defaultProfilePic,
          level: defaultLevel,
        },
      });
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


app.post('/api/useractivity', (req, res) => {
    const { user_id, story_id, survey_answers } = req.body;
  
    // Check if a record with the same user_id & story_id exists
    const sql = `SELECT * FROM Useractivity WHERE user_id = ? AND story_id = ?`;
    db3.get(sql, [user_id, story_id], (err, existingData) => {
      if (err) {
        console.error('Error querying Useractivity:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
  
      if (existingData) {
        // Update survey_answers and set new timestamp
        const updateSql = `
          UPDATE Useractivity
             SET survey_answers = ?,
                 activity_timestamp = CURRENT_TIMESTAMP
           WHERE user_id = ? AND story_id = ?
        `;
        const params = [
          JSON.stringify(survey_answers),
          user_id,
          story_id
        ];
        db3.run(updateSql, params, function(updateErr) {
          if (updateErr) {
            console.error('Error updating Useractivity:', updateErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          console.log('Useractivity updated successfully');
          res.json({ message: 'Progress updated', changes: this.changes });
        });
  
      } else {
        // Insert new record (timestamp defaults via CURRENT_TIMESTAMP)
        const insertSql = `
          INSERT INTO Useractivity
            (user_id, story_id, survey_answers, activity_timestamp)
          VALUES
            (?, ?, ?, CURRENT_TIMESTAMP)
        `;
        const params = [
          user_id,
          story_id,
          JSON.stringify(survey_answers)
        ];
        db3.run(insertSql, params, function(insertErr) {
          if (insertErr) {
            console.error('Error inserting into Useractivity:', insertErr);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
          console.log('Useractivity inserted successfully');
          res.json({ message: 'Progress recorded', id: this.lastID });
        });
      }
    });
  });
  

  

// * L O G I N

app.post("/api/login", async (req, res) => {
    try {
      const { Email, Password } = req.body;
      if (!Email || !Password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
  
      // Fetch the user by email
      db.get(
        `SELECT * FROM Users WHERE Email = ?`,
        [Email],
        (err, user) => {
          if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ error: "Internal server error" });
          }
  
          // No such user?
          if (!user || !user.Salt || !user.Password) {
            return res.status(400).json({ error: "Incorrect username or password" });
          }
  
          // Hash the incoming password with their salt
          const PHash = bcrypt.hashSync(Password, user.Salt);
  
          if (PHash !== user.Password) {
            // Wrong password
            return res.status(400).json({ error: "Incorrect username or password" });
          }
  
          // Generate JWT
          const token = jwt.sign(
            { user_id: user.Id, username: user.Username, Email },
            process.env.TOKEN_KEY,
            { expiresIn: "1h" }
          );
  
          // Update the user record with the new token and login time (optional)
          db.run(
            `UPDATE Users SET Token = ?, DateLoggedIn = CURRENT_TIMESTAMP WHERE Id = ?`,
            [token, user.Id],
            err => {
              if (err) console.error("Failed to update login time:", err);
            }
          );
  
          // Return user data + token
          return res.json({
            message: "Login successful",
            data: {
              Id: user.Id,
              Username: user.Username,
              Email: user.Email,
              Lvl: user.Lvl,
              Token: token
            }
          });
        }
      );
    } catch (err) {
      console.error("Unexpected error in /api/login:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
// ─── ADMIN ROUTES ──────────────────────────────────────────────────────────
// List all users
app.get('/api/admin/users', (req, res) => {
    db.all(
      'SELECT Id, Username, Email, Lvl, DateCreated FROM Users',
      [],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: rows });
      }
    );
  });
// app.js

// app.js (excerpt)

app.get('/api/admin/useractivity', (req, res) => {
    const sql = `
      SELECT DISTINCT
        UA.user_id,
        U.Username,
        UA.story_id,
        S.storyname,
        UA.survey_answers,
        UA.activity_timestamp,
        (
          -- get each pop1 once, in pageid order
          SELECT GROUP_CONCAT(sub.pop1, '|||')
          FROM (
            SELECT pop1, MIN(pageid) AS pageid
            FROM Storycontent
            WHERE storyid = UA.story_id
              AND pop1 IS NOT NULL
            GROUP BY pop1
            ORDER BY pageid
          ) AS sub
        ) AS questions
      FROM Useractivity UA
      JOIN Users   U ON U.Id      = UA.user_id
      JOIN Stories S ON S.storyid = UA.story_id
      ORDER BY UA.activity_timestamp DESC
    `;
  
    db.all(sql, [], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
  
      const data = rows.map(r => ({
        user_id:            r.user_id,
        Username:           r.Username,
        story_id:           r.story_id,
        storyname:          r.storyname,
        survey_answers:     JSON.parse(r.survey_answers || '[]'),
        activity_timestamp: r.activity_timestamp,
        questions:          r.questions
                              ? r.questions.split('|||').filter(q => q.trim())
                              : []
      }));
  
      res.json({ data });
    });
  });
  
  
  
  // Delete a user
  app.delete('/api/admin/users/:id', (req, res) => {
    const id = req.params.id;
    db.serialize(() => {
      db.run('BEGIN TRANSACTION;');
  
      // 1) delete any progress records
      db.run(
        'DELETE FROM Useractivity WHERE user_id = ?;',
        [id],
        function(err) {
          if (err) {
            db.run('ROLLBACK;');
            return res.status(500).json({ error: err.message });
          }
        }
      );
  
      // 2) delete the user
      db.run(
        'DELETE FROM Users WHERE Id = ?;',
        [id],
        function(err) {
          if (err) {
            db.run('ROLLBACK;');
            return res.status(500).json({ error: err.message });
          }
          db.run('COMMIT;');
          res.json({
            message:    'User and progress deleted',
            changes:    this.changes
          });
        }
      );
    });
  });
  
  // Edit/update a user
  app.put('/api/admin/users/:id', (req, res) => {
    const id = req.params.id;
    const { Username, Email, Lvl } = req.body;
    db.run(
      `UPDATE Users
          SET Username = ?,
              Email    = ?,
              Lvl      = ?
        WHERE Id = ?`,
      [Username, Email, Lvl, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User updated', changes: this.changes });
      }
    );
  });
  
  // Later: change story URL
  app.put('/api/admin/stories/:id/url', (req, res) => {
    const id = req.params.id;
    const { url } = req.body;
    db.run(
      `UPDATE Stories
          SET coverpage = ?
        WHERE storyid = ?`,
      [url, id],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Story URL updated', changes: this.changes });
      }
    );
  });
  
//question


// // * T E S T  

// app.post("/api/test", auth, (req, res) => {
//     res.status(200).send("Token Works - Yay!");
// });
// 1. Point Express at your static folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Fallback all other routes to index.html (for SPAs)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(port, () => console.log(`API listening on port ${port}!`));