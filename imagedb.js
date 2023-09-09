const createStoriesTable = () => {
    const sql = `
      CREATE TABLE IF NOT EXISTS Stories (
        storyid INTEGER PRIMARY KEY AUTOINCREMENT,
        storyname TEXT,
        storydescription TEXT,
        coverpage BLOB
      )
    `;
  
    db.run(sql);
  };
  
  // Call the function to create the Stories table
createStoriesTable();
const fs = require('fs');

const insertStory = (storyname, storydescription, coverImagePath) => {
  // Read the cover image file
  const coverImageData = fs.readFileSync(coverImagePath);

  // Convert the image data to base64
  const base64CoverImage = coverImageData.toString('base64');

  // Insert the story with the cover image data into the database
  const sql = `
    INSERT INTO Stories (storyname, storydescription, coverpage)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [storyname, storydescription, base64CoverImage]);
};

// Call the function to insert a story with the cover image
insertStory('Going to the supermarket', 'This is the  story', 'path/to/cover.jpg');
