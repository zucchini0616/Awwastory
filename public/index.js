
  // function login() {
  //   console.log("0");
  //   $(document).ready(function() {
  //      $('#login-form').submit(function(event) {
  //        event.preventDefault();
  //        const email = $('#email').val();
  //        const password = $('#password').val();
  //        console.log("1");
  //        $.ajax({
  //          url: '/login',
  //          method: 'POST',
  //          data: JSON.stringify({ Email: email, Password: password }),
  //          contentType: 'application/json',
  //          success: function(response) {
  //            console.log("2");
  //            window.location.href = 'mainpage.html';
  //            console.log(response.message);
  //            // Redirect to another page or perform further actions
  //          },
  //          error: function(error) {
  //            // Login failed
  //            console.log(error.responseJSON.message);
  //          }
  //        });
  //      });
  //    });
  //  }
  $(document).ready(function () {
    // Handle login form submission
    $('#login-form').submit(function (event) {
      event.preventDefault();
  
      var email = $('#email').val();
      var password = $('#password').val();
      console.log(password);
      // Make a POST request to the login endpoint
      $.ajax({
        url: 'http://localhost:3004/api/login',
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
  