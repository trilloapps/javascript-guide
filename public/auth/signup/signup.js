
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
var signupCardContainer = document.getElementById('signupCardContainer').style.display = 'block'
var newUserFormValue; // Declare newUserForm globally

var verificationCardContainer = document.getElementById('verificationCardContainer').style.display = 'none'
firebase.initializeApp(firebaseConfig);

function SignupSubmitForm() {
    const newp = document.getElementById('newp');
    const confirmp = document.getElementById('confirmp');
    const MatchErrorPass = document.getElementById('MatchErrorPass');
    const userIdError = document.getElementById('userIdError');
    const emailError = document.getElementById('emailError');
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const phoneNumberErr = document.getElementById('phoneNumberErr');

    const userId = document.getElementById('userIdentification').value;
    const email = document.getElementById('userEmail').value;
    const phoneNo = document.getElementById('phoneNumber').value;
    const password = document.getElementById('passinput1').value;
    const confirm = document.getElementById('passinput2').value;
    const firstName = document.getElementById('userfirstName').value;
    const lastName = document.getElementById('userlastName').value;

    // Reset error messages
    userIdError.textContent = '';
    emailError.textContent = '';
    firstNameError.textContent = '';
    lastNameError.textContent = '';
    phoneNumberErr.textContent = '';
    newp.textContent = '';
    confirmp.textContent = '';
    MatchErrorPass.textContent = '';

    // Validate form inputs for required fields
    let isValid = true;
    if (!userId) {
        userIdError.textContent = 'User ID is required';
        isValid = false;
    }
    if (!email) {
        emailError.textContent = 'Email is required';
        isValid = false;
    }
    if (!firstName) {
        firstNameError.textContent = 'First Name is required';
        isValid = false;
    }
    if (!lastName) {
        lastNameError.textContent = 'Last Name is required';
        isValid = false;
    }
    if (!phoneNo) {
        phoneNumberErr.textContent = 'Phone Number is required';
        isValid = false;
    }

    // Validate password length
    if (password.length < 8) {
        newp.textContent = 'Password must be at least 8 characters long';
        isValid = false;
    }
    if (confirm.length < 8) {
        confirmp.textContent = 'Confirm Password must be at least 8 characters long';
        isValid = false;
    }

    // Password match validation
    if (password !== confirm) {
        MatchErrorPass.textContent = 'Password and confirm password do not match';
        isValid = false;
    }

    // If form is valid, send sign-up request
    if (isValid) {
        sendSignUpRequestWithRecaptchaToken({
            userId: userId,
            email: email,
            mobilePhone: phoneNo,
            password: password,
            rptPassword: confirm,
            firstName: firstName,
            lastName: lastName,
            role: 'user',
            tenantName: 'cloud',
        });
    }
}

function validateForm(newUserForm) {
    // Check if all required fields are filled
    if (!newUserForm.userId || !newUserForm.email || !newUserForm.phoneNo ||
        !newUserForm.password || !newUserForm.confirm || !newUserForm.firstName || !newUserForm.lastName) {
        return false;
    }
    // You can add additional validation logic here if needed
    return true;
}

// Send sign-up request with reCAPTCHA token
function sendSignUpRequestWithRecaptchaToken(newUserForm) {
    var submitText = document.getElementById('submitText');
    var loader = document.getElementById('loader');
    submitText.style.display = 'none';
    loader.style.display = 'inline';
    intializeFirbase();
    newUserFormValue = newUserForm; // Assign newUserFormParam to the global newUserForm variable

    console.log(newUserForm);
    setTimeout(() => {
        submitText.style.display = 'inline';
        loader.style.display = 'none';
        let phoneNumber = newUserForm.mobilePhone; // Ensure phoneNumber is treated as a string
        console.log("Phone Number:", phoneNumber); // Log the phone number as a string
        firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
            .then(async (confirmationResult) => {
                if (recaptchaVerifier.verify()) {
                    fireBaseConfirmationResult = confirmationResult;
                    showToast('OTP code has been sent to the phone', 'success', 'success');
                    signupCardContainer = document.getElementById('signupCardContainer').style.display = 'none';
                    verificationCardContainer = document.getElementById('verificationCardContainer').style.display = 'block'
                }
            })
            .catch((error) => {
                showToast(error.message, 'danger', 'danger');
                Loader = false;
                console.error(error.message, 'error', 'danger');


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
            CallSignUpAPI();
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

function CallSignUpAPI() {
    // Validate inputs before making API call
    // Call the login API
    apiService.saveSignupDetails(newUserFormValue)
        .then(result => {
            submitText.style.display = 'inline';
            loader.style.display = 'none';
            if (result.status == 'success') {
                showToast(result.message, 'success', 'success');
                setTimeout(() => {
                    window.location.href = '/auth/login/login.html';
                    console.log("in")
                }, 1500);
            } else {
                showToast(result.message, 'error', 'danger');
                setTimeout(() => {
                    this.Loader = false;
                }, 2000);
            }
        })
        .catch(error => {
            // Display error toast on API call failure
            showToast(error.message, 'danger');
        });

}