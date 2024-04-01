// Get references to DOM elements
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');
const verificationCardContainer = document.getElementById('verificationCardContainer').style.display = 'none'

// Add text-danger class to error spans for styling
userIdError.classList.add('text-danger');
passwordError.classList.add('text-danger');

// Event listeners to clear validation messages on input
userIdInput.addEventListener('input', clearValidationMessage);
passwordInput.addEventListener('input', clearValidationMessage);

// Function to clear validation messages
function clearValidationMessage() {
    userIdError.innerText = "";
    passwordError.innerText = "";
}
// Check if the pressed key is Enter (key code 13)
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      // Call the LoginSubmitForm() function
      LoginSubmitForm();
    }
  });

// Validate user input
function validateInputs() {
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    // Check if both fields are empty
    if (!userId && !password) {
        userIdError.innerHTML = "User ID is required.";
        passwordError.innerHTML = "Password is required.";
        return false;
    }

    // Check if User ID is empty
    if (!userId) {
        userIdError.innerHTML = "User ID is required.";
        return false;
    }

    // Check if Password is empty
    if (!password) {
        passwordError.innerHTML = "Password is required.";
        return false;
    }

    // All validations passed
    return true;
}

// Function to handle form submission
function LoginSubmitForm() {
    // Validate inputs before making API call
    if (validateInputs()) {
        const userId = userIdInput.value;
        const password = passwordInput.value;

        // Call the login API
        apiService.login(userId, password)
            .then(response => {
                if (response.status == 'connected') {
                    // Store user details and access token in local storage
                    localStorageService.setItem('userDetail', JSON.stringify(response.user));
                    localStorageService.setItem('accessToken', response.accessToken);
                     document.getElementById('verificationCardContainer').style.display = 'block'
                    // Redirect to customer page on successful login
                    window.location.href = '/app/customers/customer.html';
                } else {
                    // Display error message and toast on login failure
                    console.log(response.message);
                    showToast(response.message, 'danger');
                }
            })
            .catch(error => {
                // Display error toast on API call failure
                showToast(error.message, 'danger');
            });
    }
}

//Signup Navigation
document.getElementById("signupLink").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default behavior of the link
    console.log("Signup link clicked"); // Log a message to the console
    window.location.href = "/auth/signup/signup.html"; // Redirect to the signup page
});
