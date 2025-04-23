
  $(document).ready(function () {
    // Handle login form submission
    $('#login-form').submit(function (event) {
      event.preventDefault();
  
      var email = $('#email').val();
      var password = $('#password').val();
  
      // Make a POST request to the login endpoint
      $.ajax({
        url: 'http://localhost:3000/api/login',
        method: 'POST',
        data: {
          Email: email,
          Password: password
        },
        
        success: function (response) {
          // Login successful
      
          const id = response[0].Id;
       
          localStorage.setItem('Id', id);
         
          // Store the token in localStorage or cookies if needed
          window.location.href = "/mainpage.html";
          
      
        },
        error: function (error) {
          // Login failed
    
          console.error('Login failed:', error.responseText);
        }
      });
    });
  });
  