fetch('http://13.229.232.201:3004/api/Stories')
  .then(response => response.json())
  .then(data => {
    // Check if the 'data' property exists
    if ('data' in data) {
      // Get the value of the 'data' property
      const stories = data.data;

      // Process the received data
      console.log(stories); // Display the data in the console

      // Get the container where you want to display the story cards
      const storyCardContainer = document.querySelector('.story-selection');
      
      // Create a Bootstrap row element
      const row = document.createElement('div');
      row.classList.add('row');

      // Iterate through the stories and create Bootstrap card elements
      stories.forEach(story => {
        // Create a Bootstrap column element for each story card
        const column = document.createElement('div');
        column.classList.add('col-md-4'); // Adjust the column size as needed

        // Create a Bootstrap card element
        const storyCard = document.createElement('div');
        storyCard.classList.add('card', 'mb-4'); // Add Bootstrap card classes

        // Create an image element
        const image = document.createElement('img');
        image.classList.add('card-img-top'); // Add Bootstrap card image class
        image.src = story.coverpage;
        image.alt = story.storyname;

        // Create a card body element
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // Create a heading element
        const heading = document.createElement('h2');
        heading.classList.add('card-title'); // Add Bootstrap card title class
        heading.textContent = story.storyname;

        // Create a button element
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary', 'start-reading-button'); // Add Bootstrap button classes
        button.textContent = 'Read Me!';
        button.dataset.storyid = story.storyid;

        // Add a click event listener to the button
        button.addEventListener('click', () => {
          const storyId = button.dataset.storyid;
          console.log('Clicked Read Me button for storyid:', storyId);
          storybookcontent(storyId);
          // window.location.href = "/storybook-content.html";
        });

        // Append elements to the card body
        cardBody.appendChild(heading);
        cardBody.appendChild(button);

        // Append elements to the card
        storyCard.appendChild(image);
        storyCard.appendChild(cardBody);

        // Append the card to the column
        column.appendChild(storyCard);

        // Append the column to the row
        row.appendChild(column);
      });

      // Append the row to the container
      storyCardContainer.appendChild(row);
    } else {
      // Handle the case where the 'data' property is missing or empty
      console.error('Data property not found or empty:', data);
    }
  })

  .catch(error => {
    // Handle any errors that occur during the API request
    console.error('Error:', error);
  });
  function storybookcontent(storyId) {
    // Store the storyId in your desired location, such as in the database or in a variable for further processing
    console.log('StoryId:', storyId);
    
    // Navigate to the story content page, passing the storyId as a query parameter
    window.location.href = `/storybook-content.html?storyid=${storyId}`;

  }
//------------------------------------------------------------------------- 
function logout() {
  // Clear the user ID from localStorage
  localStorage.removeItem('Id');
  // Redirect to the login page or any other desired page
  window.location.href = 'index.html';
}
//--------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Replace USER_ID with the actual user ID of the logged-in user
  const userId = localStorage.getItem('Id');
  
  console.log("check",userId)
  if (userId) {

    fetch(`http://13.229.232.201:3004/api/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        if ('data' in data) {
          const userData = data.data;

          // Get the value of the 'data' property

          // Process the received data
          console.log("see here", userData); // Display the data in the console
          // Update the username in the frontend
          const usernameElement = document.querySelector('.Username');
          usernameElement.textContent = `${userData[0].Username} !`;

          // Update the level in the frontend
          const levelElement = document.querySelector('.lvl-label');
          levelElement.textContent = `Level: ${userData[0].Lvl}`;

          const profileImgElement = document.getElementById('profile-img');
          profileImgElement.src = userData[0].Profilepic;

          
          // Update the login status in the frontend
          const loginStatusElement = document.querySelector('.login-status');
          loginStatusElement.textContent = userData.loggedIn ? 'Logged In' : 'Logged Out';
        } else {
          console.error('Data property not found or empty:', userData);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  } else {
    console.error('User ID not found in localStorage');
  }
  const logoutButton = document.querySelector('.logout-button');
  logoutButton.addEventListener('click', logout);
});
//..............................................................
// fetch(`http://localhost:3004/api/storycontent/${storyId}`)
// .then(response => response.json())
// const progressBar = document.querySelector('.progress-bar');
// function updateProgressBar() {
//   const progress = ((currentPage + 1) / pages.length) * 100;
//   progressBar.style.width = `${progress}%`;
  

//   const yourProgress = document.querySelector('.your-progress');
//   yourProgress.textContent = text[currentPage];
// }

// mainpage.js
function storybookcontent(storyId, userId) {

  // Store the storyId and userData in localStorage
  localStorage.setItem('StoryId', storyId);
  
  console.log("helllllllllppppppppp",userId)
  // Navigate to the story content page
  window.location.href = `/storybook-content.html?storyid=${storyId}`;
}
