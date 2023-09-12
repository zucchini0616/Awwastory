let currentPage = 0;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const storyId = urlParams.get('storyid');
// const userData = urlParams.get('userdata');

const surveyAnswers = []; // Initialize all answers to 0


const userId = localStorage.getItem('UserId');
console.log('UserId:', userId);
console.log('StoryId:', storyId);

fetch(`http://awwadb.c6gaxuia9dpg.ap-southeast-1.rds.amazonaws.com:3306/api/storycontent/${storyId}?userdata=${userId}`)
  .then(response => response.json())
  .then(responseData => {
    // Rest of your code to handle the API response
  })
  .catch(error => {
    console.log('Error fetching data:', error);
  });

document.addEventListener('DOMContentLoaded', () => {
  let pages;
  const storedPage = localStorage.getItem('currentPage');
  if (storedPage !== null) {
    currentPage = parseInt(storedPage, 10);
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const storyId = urlParams.get('storyid');
  console.log('StoryId:', storyId);

  fetch(`http://awwadb.c6gaxuia9dpg.ap-southeast-1.rds.amazonaws.com:3306/api/storycontent/${storyId}`)
    .then(response => response.json())
    .then(responseData => {
      const data = responseData.data;
      console.log("story",data);

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
  }

  function goToNextPage() {
    if (currentPage < pages.length - 1) {
      if (question[currentPage] !== null) {
        currentPage++;
        renderPage();
        storeUserProgress();
      } else {
        currentPage++;
        renderPage();
        storeUserProgress();
      }
    }
  }

  function goToPreviousPage() {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
      storeUserProgress();
    }
  }

  function goToFirstPage() {
    currentPage = 0;
    renderPage();
  }

  function updateProgressBar() {
    const progress = ((currentPage + 1) / pages.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  function getquestion() {
    const yourProgress = document.querySelector('.question');
    if (question[currentPage] !== null) {
      yourProgress.textContent = "question: " + question[currentPage];
    } else {
      yourProgress.textContent = "";
    }
  }

  function gethint() {
    const yourProgress = document.querySelector('.hint');
    if (hint[currentPage] !== null) {
      yourProgress.textContent = "hint: " + hint[currentPage];
    } else {
      yourProgress.textContent = "";
    }
  }

  function getpop() {
    const yourProgress = document.querySelector('.pop');
    if (pop[currentPage] !== null) {
      yourProgress.textContent = "Survey: " + pop[currentPage];
    } else {
      yourProgress.textContent = "";
    }
  }
  function storeUserProgress() {
    localStorage.setItem('currentPage', currentPage);
    console.log(currentPage)

  }
  function sendResponseToDatabase(userResponse) {
    // Assuming userResponse contains the data you want to store
    console.log("imin",userId)
    console.log("radiovalue=(",userResponse)
    
    const surveydata = {
      user_id: parseInt(userId, 10),
      survey_answers: surveyAnswers, // Send the entire array
    };
    
    
   

  fetch('http://awwadb.c6gaxuia9dpg.ap-southeast-1.rds.amazonaws.com:3306/api/useractivity', {
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
    if (question[currentPage] !== null && hint[currentPage] !== null) {
      const radioContainer = document.createElement('div');
      radioContainer.className = 'form-check';
      const nextButton = document.querySelector('#next-button');
      const radioYes = createRadioButton(`page-answer`, 'Yes', 1);
      const radioNo = createRadioButton(`page-answer`, 'No', 0);
  
      radioContainer.appendChild(radioYes);
      radioContainer.appendChild(radioNo);
      yourProgress.innerHTML = '';
      yourProgress.appendChild(radioContainer);
  
      nextButton.disabled = true;
  
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', () => {
          nextButton.disabled = !Array.from(radioButtons).some(rb => rb.checked);
          if (radio.checked) {
            surveyAnswers[currentPage] = parseInt(radio.value, 10);
          }
        });
      });
    } else {
      yourProgress.innerHTML = '';
    }
    nextButton.addEventListener('click', () => {
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      let userResponse = null;
  
      radioButtons.forEach(radio => {
 
        if (radio.checked) {
          userResponse = radio.value; // Assuming you have 'value' attribute set for the radio buttons.
      
        }
      });
  
      if (userResponse !== null) {
        // Send userResponse to your database using a fetch request.
        sendResponseToDatabase(userResponse);
        console.log("im not getting anything here")
        // Update user's current page in local storage
        storeUserProgress();
      }
    });
  }
  $(document).ready(function () {
    // Function to toggle the sidebar
    function toggleSidebar() {
      $("#sidebar").toggleClass("active");
      $("#question-button").toggleClass("active");
    }
  
    
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
  
    // Initially close the sidebar when the page loads
    $("#sidebar").removeClass("active");
    $("#question-button").removeClass("active");
  });
  
  $(document).ready(function() {
    $("#next-button").on("click", function() {
      $("#sidebar").toggleClass("active");
      $(this).toggleClass("active");
    });
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

window.addEventListener('orientationchange', function() {
  var rotateMessage = document.getElementById('rotate-message');
  var isMobile = window.matchMedia("(max-width: 767px)").matches;
  var isPortrait = window.innerWidth < window.innerHeight;

  if (isMobile && isPortrait) {
    rotateMessage.style.display = 'none';
  } else {
    rotateMessage.style.display = 'flex';
  }
});
