$(document).ready(function () {
    // Handle registration form submission
    $('#register-form').submit(function (event) {
      event.preventDefault();
  
      var username = $('#username').val();
      var email = $('#email').val();
      var password = $('#password').val();
  
      // Make a POST request to the registration endpoint
      $.ajax({
        url: 'http://13.229.232.201:3000/api/register',
        method: 'POST',
        data: {
          Username: username,
          Email: email,
          Password: password
        },
  
        success: function (response) {
          // Registration successful
          console.log('Registration successful:', response);
          // You can perform actions after successful registration, such as redirecting to a login page.
          window.location.href = '/index.html'; // Replace with your desired login page URL
        },
        error: function (error) {
          // Registration failed
          console.error('Registration failed:', error.responseText);
          // You can display an error message to the user or perform other error handling.
        }
      });
    });
  });
  