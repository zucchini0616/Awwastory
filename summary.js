
let storyId;
function returnToMain() {
    window.location.href = 'mainpage.html';
}
// script.js



document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const storyId = localStorage.getItem('StoryId');
    const userId = localStorage.getItem('Id');

    // Function to create a card with a specific format
    function createCard(item, container) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.style.marginBottom = '10px';

        // Card header
        const cardHeader = document.createElement('div');
        cardHeader.classList.add('card-header');
        cardHeader.textContent = item.pop1;
        card.appendChild(cardHeader);

        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        // User response paragraph
        // const userResponse = document.createElement('p');
        // userResponse.textContent = `User's response: ${item.survey_answers}`;
        // cardBody.appendChild(userResponse);

        // Add other content elements as needed

        card.appendChild(cardBody);
        container.appendChild(card);
    }


    // Fetch storycontent data
    fetch(`http://13.229.232.201:3000/api/storycontent/${storyId}`)
        .then(response => response.json())
        .then(responseData => {
            const data = responseData.data;
            const filteredData = data.filter(item => item.pop1 !== null);

            const storyContentContainer = document.getElementById('storyContent');

            filteredData.forEach(item => {
                createCard(item, storyContentContainer);
            });
        })
        .catch(error => {
            console.log('Error fetching story content data:', error);
        });

    // Fetch useractivity data
    fetch(`http://13.229.232.201:3000/api/useractivity/${userId}/${storyId}`)
        .then(response => response.json())
        .then(responseData => {
            const data = responseData.data;
            const inputString = data[0].survey_answers;

            // Replace "null" with null
            const jsonString = inputString.replace(/null/g, "null");

            // Parse the JSON string into an array
            const resultArray = JSON.parse(jsonString).filter(item => item !== null);

            console.log(resultArray);

            // Select all card-body elements
            // Select all existing card-body elements
            const cardBodies = document.querySelectorAll('.card-body');

            for (let i = 0; i < resultArray.length; i++) {
                console.log("hhi");
                const item = resultArray[i];
                console.log("item:", item);
                if (item !== null) {
                    console.log('Entering if block for item:', item);
            
                    // Create a new card-body element if it doesn't exist
                    let cardBody = cardBodies[i];
                    if (!cardBody) {
                        cardBody = document.createElement('div');
                        cardBody.classList.add('card-body');
                    }
            
                    // Convert the value to "Yes" or "No" and append it to the card-body
                    const userResponse = document.createElement('p');
                    userResponse.textContent = `User's response: ${item === 1 ? 'Yes' : 'No'}`;
                    cardBody.appendChild(userResponse);
            
                    // Append or add the card-body to the corresponding card
                    if (!cardBodies[i]) {
                        const card = document.querySelector('.card'); // You may need to adjust this selector
                        card.appendChild(cardBody);
                    }
            
                    console.log('hihi', item);
                } else {
                    console.log('Skipping item:', item);
                }
            }


        })
        .catch(error => {
            console.log('Error fetching user activity data:', error);
        });

});


