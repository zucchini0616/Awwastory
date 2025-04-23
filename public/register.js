document.addEventListener("DOMContentLoaded", function () {
  var registrationForm = document.querySelector("form.row.g-3");

  registrationForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    if (validateForm()) {
      // Form data is valid, send it to the server
      sendFormData();
    }
  });

  function validateForm() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    var isValid = true;

    if (username === "") {
      isValid = false;
      setInvalidField("username", "Please enter your full name.");
    } else {
      setValidField("username");
    }

    if (email === "") {
      isValid = false;
      setInvalidField("email", "Please enter a valid email address.");
    } else {
      setValidField("email");
    }

    if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
      isValid = false;
      setInvalidField(
        "password",
        "Password must contain at least 8 characters, including at least one letter and one number."
      );
    } else {
      setValidField("password");
    }

    if (confirmPassword !== password) {
      isValid = false;
      setInvalidField("confirm-password", "Passwords do not match.");
    } else {
      setValidField("confirm-password");
    }

    return isValid;
  }

  function setValidField(fieldId) {
    var field = document.getElementById(fieldId);
    field.classList.remove("is-invalid");
    field.classList.add("is-valid");
  }

  function setInvalidField(fieldId, message) {
    var field = document.getElementById(fieldId);
    field.classList.remove("is-valid");
    field.classList.add("is-invalid");
    field.nextElementSibling.textContent = message;
  }
  function sendFormData() {
    var username = document.getElementById("username").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    var formData = {
      username: username,
      email: email,
      password: password,
    };

    fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to register user.');
        }
      })
      .then(function (data) {
        // Data sent to the server successfully, redirect to success page
        window.location.href = "successpage.html";
      })
      .catch(function (error) {
        console.error(error);
        // Handle the error, e.g., display an error message to the user
      });
  }
});
