// index.js

$(document).ready(function () {
  $('#login-form').submit(function (event) {
    event.preventDefault();
    $('#loginError').text('');

    const email    = $('#email').val().trim();
    const password = $('#password').val();

    $.ajax({
      url: 'http://localhost:3000/api/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ Email: email, Password: password }),

      success: function (response) {
        // response.data holds { Id, Username, Email, Lvl, Token }
        const user = response.data;
        localStorage.setItem('Id',    user.Id);
        localStorage.setItem('Token', user.Token);

        // *** Redirect based on admin account ***
        if (user.Username === 'awwastoryadmin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'mainpage.html';
        }
      },

      error: function (xhr) {
        let msg = 'Login failed';
        if (xhr.responseJSON && xhr.responseJSON.error) {
          msg = xhr.responseJSON.error;
        } else if (xhr.responseText) {
          msg = xhr.responseText;
        }
        $('#loginError').text(msg);
        console.error('Login error:', msg);
      }
    });
  });
});
