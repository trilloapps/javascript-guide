var verificationCardContainer = document.getElementById('verificationCardContainer').style.display = 'none'
var loginResponse;
var newUserFormValue; // Declare newUserForm globally

// Get references to DOM elements
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');

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
document.addEventListener('keydown', function (event) {
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

var firebaseConfig = {
    apiKey: "AIzaSyBfrqkb624X9THB5LxM_cgJ695hbfpfSaQ",
    authDomain: "apps-demo-2-402107.firebaseapp.com",
    projectId: "apps-demo-2-402107",
    storageBucket: "apps-demo-2-402107.appspot.com",
    messagingSenderId: "719788448180",
    appId: "1:719788448180:web:8d10f5123f237ac16e7ae1",
    measurementId: "G-M5G0BPWW0M",
    vapidKey: "BP7nIinCI9PedAuuEysl6bmWq-jrWeK0UZ6NK0F8E4KtUJ4B8oW98FxUHtaDWm7fQ_yECcc27RH6CNqh4AOruv0"
};
firebase.initializeApp(firebaseConfig);

// Function to handle form submission
function LoginSubmitForm() {
  var submitText = document.getElementById('submitText');
  var loader = document.getElementById('loader');

    // Validate inputs before making API call
    if (validateInputs()) {
        const userId = userIdInput.value;
        const password = passwordInput.value;
        submitText.style.display = 'none';
        loader.style.display = 'inline';
        // Call the login API
        apiService.login(userId, password)
            .then(response => {
                submitText.style.display = 'inline';
                loader.style.display = 'none';
                if (response.status == 'connected') {
                    loginResponse = response
                    sendSignUpRequestWithRecaptchaToken(response.user.mobilePhone)
                } else {
                    // Display error message and toast on login failure
                    console.log(response.message);
                    showToast(response.message, 'danger', 'danger');
                }
            })
            .catch(error => {
                // Display error toast on API call failure
                showToast(error.message, 'danger', 'danger');
            });
    }
}

//Signup Navigation
document.getElementById("signupLink").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default behavior of the link
    console.log("Signup link clicked"); // Log a message to the console
    window.location.href = "/auth/signup/signup.html"; // Redirect to the signup page
});



function sendSignUpRequestWithRecaptchaToken(mobilePhone) {
    intializeFirbase();
    console.log(mobilePhone);
    setTimeout(() => {
        Loader = true;
        let phoneNumber = mobilePhone; // Ensure phoneNumber is treated as a string
        console.log("Phone Number:", phoneNumber); // Log the phone number as a string
        firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
            .then(async (confirmationResult) => {
                if (recaptchaVerifier.verify()) {
                    fireBaseConfirmationResult = confirmationResult;
                    console.log(fireBaseConfirmationResult, 'OTP code has been sent to the phone', 'success', 'success');
                    signupCardContainer = document.getElementById('loginCardContainer').style.display = 'none';
                    verificationCardContainer = document.getElementById('verificationCardContainer').style.display = 'block'
                }
            })
            .catch((error) => {
                showToast(error.message, 'danger', 'danger');
                Loader = false;
                console.error(error.message, 'error', 'danger')
            });

    }, 2500);

}

function intializeFirbase() {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    } else {
        firebase.app();
        console.log("Firebase app already initialized.");
    }
    setTimeout(() => {
        recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container-login', {
            'size': 'invisible' // Set to 'invisible' for an invisible reCAPTCHA
        });
        console.log("recaptchaVerifier", this.recaptchaVerifier);
    }, 2000);
}

// Add an event listener to the form submission
document.getElementById('verificationForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior
    // Call the verifyToken function when the form is submitted
    verifyToken();
});

function verifyToken() {
    console.log(newUserFormValue)
    let pinInput = document.getElementById('verificationCode');
    let pin = pinInput.value;
    this.Loader = true;
    console.log("pin", pin)
    console.log(fireBaseConfirmationResult, "fireBaseConfirmationResult", pin)
    this.fireBaseConfirmationResult.confirm(pin)
        .then(async (result) => {
            // Store user details and access token in local storage
            localStorageService.setItem('userDetail', JSON.stringify(loginResponse.user));
            localStorageService.setItem('accessToken', loginResponse.accessToken);
            // Redirect to customer page on successful login
            window.location.href = '/app/customers/customer.html';
        })
        .catch((error) => {
            this.Loader = false;
            showToast('Invalid code!', 'error', 'danger');
        })
        .catch((error) => {
            this.Loader = false;
            showToast('An internal server error occurred. Please try again later.', 'error', 'danger');
        });
}


