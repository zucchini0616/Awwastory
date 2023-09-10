const express = require('express');
const app = express();
require("dotenv").config();
const port = 3004;
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
                    // const fs = require('fs');
                    // console.log("hihi go away")
                    
                    // const insertStory = (storyname, storydescription, coverImagePath) => {
                    //     // Read the cover image file
                    //     const coverImageData = fs.readFileSync(coverImagePath);
                    
                    //     // Convert the image data to base64
                    //     const base64CoverImage = coverImageData.toString('base64');
                    
                    //     // Insert the story with the base64-encoded cover image data into the database
                    //     const sql = `INSERT INTO Stories (storyname, storydescription, coverpage) VALUES (?, ?, ?)`;
                    //     const params = [storyname, storydescription, base64CoverImage];
                    
                    //     db2.run(sql, params);
                    // };
                    
                    // // Call the function to insert a story with the cover image
                    // insertStory('Going to the supermarket', 'This is the first story', 'images/Story1.jpg');
                    // insertStory('Visiting Grandparents', 'This is the second story', 'images/Story2.jpg');
                    // console.log("hihi come here")
                    
                    
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
            // console.log("Questions table created successfully");
            // const fs = require('fs');
           
                
            //     const insertQuestions = (QuestionNofk, question,answer, difficulties) => {
            //         // Read the cover image file
                   
            //         // Insert the story with the base64-encoded cover image data into the database
            //         const sql = `INSERT INTO Questions (QuestionNofk, question,answer, difficulties) VALUES (?,?,?,?)`;
            //         const params = [QuestionNofk, question,answer, difficulties];
                
            //         db4.run(sql, params);
            //     };
                
            //     // Call the function to insert a story with the cover image
            //     insertQuestions('1', 'What are they doing?','Mum was going to make them their...','1');
            //     insertQuestions('1', 'show me some groceries.','Mum needed sugar,eggs...','2');
            //     insertQuestions('2', 'what does Jadyden have in his pocket','shopinglist','1');
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
                // console.log("Storycontent table created successfully");
                // const fs = require('fs');
           
                
                // const insertStorycontent = (storyid, content,contenttxt, questionid) => {
                //     // Read the cover image file
                   
                //     // Insert the story with the base64-encoded cover image data into the database
                //     const sql = `INSERT INTO Storycontent (storyid, content, contenttxt,questionid) VALUES (?,?,?,?)`;
                //     const params = [storyid, content,contenttxt, questionid];
                
                //     db4.run(sql, params);
                // };
                
                // // Call the function to insert a story with the cover image
                // insertStorycontent('1', 'https://lh3.googleusercontent.com/fife/APg5EObjn8zNX5NFQj3gwUrf8MBpGB_ARIx_8kUFSNqUzzgEgTGiAO66JJkb2uma2JxnLdHo2nNGxN3zMOxOHs3ErNZspRv7k_H34UcLGs7RGQ9yZYpvxYk0tT9dZEO0YkOmCox19uYYG8WQ6-mHZjEkG3bzwjbra7EyxAPSPycCS_s7x_MW-ScItiqWrEb-eSloqETCnrD4GU5SZc2abHdyJnPMH7SqEhE0LMAmelRmrnKe4XKHc4QCQkGzB2tuyKRs_WR0s1ybxcy572Ee7f9aNEoBFaxJynER1douq89H5x8nAjNOiyCEnc6ObrWsVjRFBORj6JGtIhhjKC1bw_1-lChVITuZLEGkYoqAQrP2zXQnsngLhv1ZX6rteh7Ied2M1nCIleOVfA-Twpkrz8Mhy0N8oLOxeE90WppnxQMAeeGIJqdnr2_Bm8yM9OqxYaT4DfROunMHeQVSRTa3zON5cXQPezSBhWSP8AMXe3fF9_Y6s-JHCNEMMzKVQl7FS21vQzmbD2eE4c6XXh7ifnpzVdQoJ3TpNAf4uWmmVQVn1CxF128qodJzF9-at7rbYvq-wHXXWrI2CjBdLM8t7DnqHt8gMbH_NJzzru9tp96rVCs42KAiy3-Co-lCWM7lU0YBrI5WDoZEPMcc1wpHxGobLg5wQAQtNK_KLXr4ElYsrjLtsvL3JTEISr3LraeKRbZ1gK4vetgfLoy0m-dSx6UlVx5iWNkUUpZz_cx2qq03xQJo_re5lURc1d4YY5UGmx0t5uKs_15OoVWA8h9_HBQ5VarPN7Z5Q0yuYva9OMnVDMl6WolYMY2BTcp5t6hiz6qis_nBHLU4pjeLH_SJSYaEopicErzcZb_NqqMtGhF8Iw__XMBYcRdrmtrwcPuENUpdun5ONNsxLoOkVq96E7U94b61fIUUlzM7DGtAJ_VC3fnsjEcLmlLO4SyczSKx9TgN7KDj1yLr6rHXTg7-1nEN3Ds5b-QvO9H7m32C6RnsidY9u7VC_lQhUjGOc9urIBAXfvcRvQvss-BWEcSecoABa6eJ3--ORQGizmUrJv_drjao65Vj-b487st1ew=w1920-h960','Jayden and his sister,Jamie...','1');
                // insertStorycontent('1', 'https://lh3.googleusercontent.com/fife/APg5EOZ0-fvk69U-XFwoOI8q8tY4VKyxPnR2I3EPSamM83tdZGitCkfiDYsiL-NRQDqjgNn3IYJBFIM66cM0HquSk5604SpwITUpdWrv_vdWzO1R-huXy4oJ3TkocAnRl89XFlAj8j-idfmpw2zeUITrjIFhE8d7WrNr9pesIoUMPvK1YB0tXq4KLWzajwlvPcCdNMGy5nFDFYv6PyZXwNAqrVXuChaansdPuOTJkHeXsrQZxDRjGhcsTOVHPESBHMSH8fdW4WjzzWXu_c_SxnzlMBUk4yos_rK2qISoUmmu8GgJPha5fY8egEni4Y2paLQHk7G6UqQwOjcizQyxEHTbcmxlg_JC63DUznGWpTDxyi-Vky-0ooWzdf3H40KJugd63_CCbU9EHvutV-btaBLILaR5PH5zRE0D2hG2DNSw79scECME9hZTfw4oPzHicl_4TOKaHBPKRqZ2tIY80pkiBAuJSsY3OxiUbsGnLhW6--EZmWBWixmY4Qy1TZKObud1s7juahVNSlpG_B9k6NwmlpgU9wHXKmH5jDFnSAJpAHnNOQpoE6IGdlf8hJdGhiQqu8OOuVevIeA0N6Ol_VHKbSQteKdccgQlKi6YnQjGEp-yNrL9hf3oA1h5BWewYd71XGWt6JVjkwbMkl9uCSA6uaGzZ_Z4AleuEY-Iamc-Sc1HxSV5vVwwM_VStC4wvgB0Mhc1ILmZkXiX8Arz_G3Pf12-pgFebEat08aiPsRwPWT-7aS1thTk-qBd1lGzpl101LKn4rJ59Gziw-NQBegYICW-J_GvoqeQBBlDzWnSLFHH_kAZQfLhwWzssjt4ruUlLX2ch2uM6dpkhoFNPn3LmdyV7VDxdDLWwMeOLjdR8rOuS7AMjcmgXlelehTex2vfKXqN_SS1RqZ9OgA0e1pznaYs_xga5durvlt2AIcT49rwEPkpqgDjVPoeOf0WkX5-CD8cF_dw_1d4DPcySYyRVLt9mdM_JAsn3zxY6poZmlVAj4hkFGW1i-0N-eyh95ISRLuyz3HGVTxSkggqbmaViKBDC4Z86kuqqFOks3EjRm4tSLQVUsmoIwNkOg=w1920-h960','Jayden and his sister,Jamie...','1');
                // insertStorycontent('1', 'https://lh3.googleusercontent.com/fife/APg5EOZVCdZOAuBTInv9660jUOUsqGclCrpFohJfxj4RJ1bjB-fXP2byPHvs6NH1KcJhiRKMim5DGuwYqEtjce6yBqkbmzAGVvT-aCgKrkRE1yeqSR8vMmURJZQlpda5TGpMYM932Iyq6WW1FVcZDNKQqdIu9caGAM0z_BYKzzkHDTDqywrEUB_kegCPwolnL8lFNsU-IXG2cWZEiLT1pNRWnlIJ0Uo_Mm_5pE7FwKH87ODv9NisyvsK81PwWZnI3Mdx4xuIMc9U0aG4UR4ArTR7OkC3FsgO0IxZDLNBO-00d-oQGF31sBvirKtoKzNdczApmWCwUzT85oCpkcfQiGH7jYus3VNPVX0ldPqDgdag6T4kIe9uImSj66ega7phctBbiqRGaL4ScU4xApww_0ibEHua3-NjfkqnEFcLynguezK1ssUaJEJA_jEPKsxFbWwdkdmxmXL8AgoinBo3kFFEqZOueNfAukEIkcfoxHDyfmS67m-C46a_qTgR9PlPQcJGMrhHTynKtwIiglx3y11wtu1whlVN_rhBXI-zxNl7M11iQR91ctjVzzigxmTvQwPSRPPNme_7sJEoYruZ-v6S4vl94HEnMN2CA-IkhNtyZrtKofpgLsH730bliAqtoQhH3KVM_wydZ1FA5c8BzwMFEyOOgbaWdbzvoKhzZmp51UK4SeaM7yK3--UGCPrIvPEWX-Ee1ZILWi6wCvArE1KYmOf_pklUckRGl66xgAEyJPaopSrNGnUaS6A0xbCfRgY0aneVKXU-2omnGp04OcbRrDSe9HcHIZILVWa-SAK8dloH1UKCDWyTJL2_I_MGYmg62s6fvUFOwt9X4u5r62fV_xNkn0QZAH9_nRyg2gpwBBf_tb2yIHsxl1-w_pShRUrVu3n5xKuP61jNwO7I1GellVtg-WKYRV3z83J2ruLH-USfBwI9Zqx0LHyi6KR-y7XxVok3ZxAIe15RXPB1DFGzw6XY0nF4xEzgYFJfRtNeIEDI8x6Yoz3krY2nMh9EGorUnSxk0r5WdJQrBqeX92C6AlpCxuFbKyzDp912nVuSQ0QQV0JfYkiyiiPzTw=w1920-h960','Mum was going to...','2');
                
                
            }
        });
    }
});



module.exports = db;
module.exports = db2;
module.exports = db3;
module.exports = db4;


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