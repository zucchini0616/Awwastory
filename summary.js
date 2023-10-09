
let storyId;
function returnToMain() {
    window.location.href = 'mainpage.html';
}
// script.js



document.addEventListener('DOMContentLoaded', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const storyId = localStorage.getItem('StoryId');

    fetch(`http://13.229.232.201:3000/api/storycontent/${storyId}`)
        .then(response => response.json())
        .then(responseData => {
            const data = responseData.data;
            const filteredData = data.filter(item => item.pop1 !== null);
            const storyContentContainer = document.getElementById('storyContent');
            
            filteredData.forEach(item => {
                // Create a Bootstrap card
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
                const userResponse = document.createElement('p');
                userResponse.textContent = `User's response: ${item.pop1}`; // Replace with your data source
                cardBody.appendChild(userResponse);

                // Add other content elements as needed

                card.appendChild(cardBody);
                storyContentContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
        fetch(`http://13.229.232.201:3000/api/useractivity/${user_id}`)
        .then(response => response.json())
        .then(responseData => {
            const data = responseData.data;
            console.log("data for response",data)            
            data.forEach(item => {
                // Create a Bootstrap card
                

                // Card body
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');

                // User response paragraph
                const userResponse = document.createElement('p');
                userResponse.textContent = `User's response: ${item.survey_answers}`; // Replace with your data source
                cardBody.appendChild(userResponse);

                // Add other content elements as needed

                card.appendChild(cardBody);
                storyContentContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
});

