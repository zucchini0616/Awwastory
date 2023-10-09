let currentPage = 0;

function setCanvasDimensions() {
  const canvasContainer = document.querySelector('.canvas-container');
  const canvas = document.querySelector('.canvas');

  const aspectRatio = 2560 / 1600; // Your desired aspect ratio

  // Calculate canvas width and height based on the viewport size and aspect ratio
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let canvasWidth, canvasHeight;

  if (viewportWidth / viewportHeight > aspectRatio) {
    // Viewport is wider than the aspect ratio
    canvasWidth = viewportHeight * aspectRatio;
    canvasHeight = viewportHeight;
  } else {
    // Viewport is taller than the aspect ratio
    canvasWidth = viewportWidth;
    canvasHeight = viewportWidth / aspectRatio;
  }

  // Calculate the left position to center the canvas horizontally
  const canvasLeft = (viewportWidth - canvasWidth) / 2;

  // Set the canvas and container dimensions and position
  canvasContainer.style.paddingTop = `${(canvasHeight / canvasWidth) * 100}%`;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  canvas.style.left = `${canvasLeft}px`;
}
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const storyId = urlParams.get('storyid');
// const userData = urlParams.get('userdata');

const surveyAnswers = new Array(currentPage.length).fill(null);// Initialize all answers to 0


const userId = localStorage.getItem('Id');
console.log('UserId:', userId);
console.log('StoryId:', storyId);

fetch(`http://13.229.232.201:3000/api/storycontent/${storyId}?userdata=${userId}`)
  .then(response => response.json())
  .then(responseData => {
    // Rest of your code to handle the API response
  })
  .catch(error => {
    console.log('Error fetching data:', error);
  });
  document.addEventListener('DOMContentLoaded', () => {
    let pages;
  
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const storyId = urlParams.get('storyid');
    console.log('StoryId:', storyId);
  
    // Retrieve the current page for the specific story from local storage
    const storedPage = localStorage.getItem(`currentPage_${storyId}`);
    if (storedPage !== null) {
      currentPage = parseInt(storedPage, 10);
    } else {
      // Set a default value for currentPage when the entry is missing
      currentPage = 0; // You can choose any default page number
    }
  console.log('StoryId:', storyId);

  fetch(`http://13.229.232.201:3000/api/storycontent/${storyId}`)
    .then(response => response.json())
    .then(responseData => {
      const data = responseData.data;
      console.log("story", data);

      pages = data.map(item => item.content);
      text = data.map(item => item.contenttxt);
      question = data.map(item => item.lvl1Question);
      hint = data.map(item => item.Hint1);
      pop = data.map(item => item.pop1);
      console.log(question)

      renderPage();

      nextButton.addEventListener('click', goToNextPage);
      returnButton.addEventListener('click', goToPreviousPage);
      goToFirstPageButton.addEventListener('click', goToFirstPage);
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });

  const canvas = document.querySelector('.canvas');
  const returnButton = document.querySelector('#return-button');
  const nextButton = document.querySelector('#next-button');
  const progressBar = document.querySelector('.progress-bar');
  const goToFirstPageButton = document.getElementById('go-to-first-page');

  function renderPage() {

    const pageImage = document.createElement('img');
    pageImage.src = pages[currentPage];
    canvas.innerHTML = '';
    canvas.appendChild(pageImage);
    updateProgressBar();
    getquestion();
    gethint();
    getpop();
    radioForm();
    if (question[currentPage] === null) {
      nextButton.disabled = false;

    }
  }
  // Function to check screen orientation and display/hide the message accordingly
  // Function to check screen orientation and display/hide the message accordingly
  function checkScreenOrientation() {
    const rotateMessage = document.getElementById('rotate-message');
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const isLandscape = window.innerWidth > window.innerHeight; // Check if width > height

    if (isMobile && !isLandscape) {
      // Show the rotate message only in portrait mode on mobile devices
      rotateMessage.style.display = 'flex';
    } else {
      // Hide the rotate message
      rotateMessage.style.display = 'none';
    }
  }

  // Attach an event listener for orientation change and window resize
  window.addEventListener('orientationchange', checkScreenOrientation);
  window.addEventListener('resize', checkScreenOrientation);

  // Call the function initially to check screen orientation
  checkScreenOrientation();


  function goToNextPage() {
    if (currentPage < pages.length - 1) {
      const userResponse = surveyAnswers[currentPage]; // Define userResponse here
      if (question[currentPage] !== null) {
        currentPage++;
        renderPage();
      } else {
        currentPage++;
        renderPage();
      }
      // Update and store the current page
      storeUserProgress();
      
      // Send userResponse to your database using a fetch request.
      sendResponseToDatabase(userResponse);
    } else {
      window.location.href = 'summary.html';
    }
  }
  

  function goToPreviousPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
      // Update and store the current page
      storeUserProgress();
    }
  }

  function goToFirstPage() {
    currentPage = 0;
    renderPage();
    // Update and store the current page
    storeUserProgress();
  }

  function updateProgressBar() {
    const progress = ((currentPage + 1) / pages.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function getquestion() {
    const yourProgress = document.querySelector('.question');
    if (question[currentPage] !== null) {
      yourProgress.textContent = "Ask: " + question[currentPage];
    } else {
      yourProgress.textContent = "";
    }
  }

  function gethint() {
    const yourProgress = document.querySelector('.hint');
    if (hint[currentPage] !== null) {
      yourProgress.textContent = "Comment: " + hint[currentPage];
    } else {
      yourProgress.textContent = "";
    }
  }

  function getpop() {
    const yourProgress = document.querySelector('.pop');
    if (pop[currentPage] !== null) {
      yourProgress.textContent = "Survey: " + pop[currentPage] + "(Please fill in before moving to the next page)";
    } else {
      yourProgress.textContent = "";
    }
  }
  function storeUserProgress() {
    localStorage.setItem(`currentPage_${storyId}`, currentPage);
    console.log(currentPage)

  }
  function sendResponseToDatabase(userResponse) {
    // Assuming userResponse contains the data you want to store

    console.log("radiovalue=(", userResponse)

    const surveydata = {
      user_id: parseInt(userId, 10),
      survey_answers: surveyAnswers, // Send the entire array
    };

    console.log("=( whereyou go",surveydata)


    fetch('http://13.229.232.201:3000/api/useractivity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',

      },
      body: JSON.stringify(surveydata), // Send the surveydata object in the request body
    })
      .then(response => {
        console.log("response", surveydata);
        console.log('Server Response:', response);
        return response.json();
      })
      .then(responseData => {
        console.log("responseData", surveydata);
        console.log('Response Data:', responseData);
      })
      .catch(error => {
        console.log("error", surveydata);
        console.log('Error sending data to the database:', error);
      });

  }


  function radioForm() {
    const yourProgress = document.querySelector('.SurveyForm');

    const nextButton = document.querySelector('#next-button');
  
    if (question[currentPage] !== null && hint[currentPage] !== null) {
      const radioContainer = document.createElement('div');
      radioContainer.className = 'form-check';
  
      const radioYes = createRadioButton(`page-answer`, 'Yes', 1);
      const radioNo = createRadioButton(`page-answer`, 'No', 0);
  
      radioYes.style.transform = 'scale(1)'; // Adjust the scale factor as needed
      radioNo.style.transform = 'scale(1)';
  
      radioContainer.appendChild(radioYes);
      radioContainer.appendChild(radioNo);
  
      yourProgress.innerHTML = '';
      yourProgress.appendChild(radioContainer);
  
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      function handleRadioButtonChange() {
       
        nextButton.disabled = !Array.from(radioButtons).some(rb => rb.checked);
    
        const selectedRadio = Array.from(radioButtons).find(rb => rb.checked);
    
        if (selectedRadio) {
          if (selectedRadio.value === '1') {
            surveyAnswers[currentPage] = 1; // Set user response to 1 for "Yes"
            console.log("1");
          } else if (selectedRadio.value === '0') {
            surveyAnswers[currentPage] = 0; // Set user response to 0 for "No"
            console.log("0");
          }
        } else {
          surveyAnswers[currentPage] = null; // No option selected
          console.log("No option selected");
        }
    
        console.log("Radio Button Value Changed:", surveyAnswers[currentPage]);
      }
      
      
      
      
  
      radioButtons.forEach(radio => {
        radio.addEventListener('change', handleRadioButtonChange);
      });
  
      nextButton.addEventListener('click', () => {
        const userResponse = surveyAnswers[currentPage];
        console.log("User Response:", userResponse); // Corrected console.log statement
        if (userResponse !== null) {
          // Send userResponse to your database using a fetch request.
          sendResponseToDatabase(userResponse);
          // Update user's current page in local storage
          storeUserProgress();
          
     
  
          if (currentPage < pages.length - 1) {
            renderPage();
          } else {
            // Navigate to the summary page with user responses as query parameters
            const queryString = Object.keys(userResponses).map(key => {
              return `${encodeURIComponent(`responses[${key}][question]`)}=${encodeURIComponent(userResponses[key].question)}&${encodeURIComponent(`responses[${key}][response]`)}=${encodeURIComponent(userResponses[key].response)}`;
            }).join('&');
            window.location.href = `summary.html?${queryString}`;
          }
        } 
      });
    } else {
      yourProgress.innerHTML = '';
    }
  }
  
  


  $("#sidebar")


  $("#question-button").on("click", function () {
    if (
      question[currentPage] === null &&
      hint[currentPage] === null &&
      pop[currentPage] === null
    ) {
      goToNextPage();
    } else {
      $("#sidebar").toggleClass("active"); // Toggle the "active" class on the sidebar
      $(this).toggleClass("active");

    }
  });
  window.addEventListener('resize', setCanvasDimensions);

  // Call the function initially to set canvas dimensions
  setCanvasDimensions();

});

$(document).ready(function () {
  $("#next-button").on("click", function () {
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
  });
});


function createRadioButton(name, label, value) {
  const radioContainer = document.createElement('div');
  radioContainer.className = 'form-check';
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = name;
  radio.value = value;
  radio.required = true;
  const radioLabel = document.createElement('label');
  radioLabel.textContent = label;
  radioContainer.appendChild(radio);
  radioContainer.appendChild(radioLabel);
  return radioContainer;
}

function returntomain() {
  window.location.href = 'mainpage.html';
}

window.addEventListener('orientationchange', function () {
  var rotateMessage = document.getElementById('rotate-message');
  var isMobile = window.matchMedia("(max-width: 767px)").matches;
  var isPortrait = window.innerWidth < window.innerHeight;

  if (isMobile && isPortrait) {
    rotateMessage.style.display = 'none';
  } else {
    rotateMessage.style.display = 'flex';
  }
});
