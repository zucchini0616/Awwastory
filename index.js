
  $(document).ready(function () {
    // Handle login form submission
    $('#login-form').submit(function (event) {
      event.preventDefault();
  
      var email = $('#email').val();
      var password = $('#password').val();
      console.log(password);
      // Make a POST request to the login endpoint
      $.ajax({
        url: 'http://13.229.232.201:3000/api/login',
        method: 'POST',
        data: {
          Email: email,
          Password: password
        },
        
        success: function (response) {
          // Login successful
          console.log('Login successful:', response);
          const id = response[0].Id;
       
          localStorage.setItem('Id', id);
         
          // Store the token in localStorage or cookies if needed
          window.location.href = "/mainpage.html";
          
          console.log("hi???")
        },
        error: function (error) {
          // Login failed
          console.log("yes?")
          console.error('Login failed:', error.responseText);
        }
      });
    });
  });
  