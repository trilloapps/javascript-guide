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

    // Validate form inputs for required fields
    if (!userId) {
        userIdError.textContent = 'User ID is required';
    }
    if (!email) {
        emailError.textContent = 'Email is required';
    }
    if (!firstName) {
        firstNameError.textContent = 'First Name is required';
    }
    if (!lastName) {
        lastNameError.textContent = 'Last Name is required';
    }
    if (!phoneNo) {
        phoneNumberErr.textContent = 'Phone Number is required';
    }

    // Validate password length
    if (password.length < 8) {
        newp.textContent = 'Password must be at least 8 characters long';
    }
    if (confirm.length < 8) {
        confirmp.textContent = 'Confirm Password must be at least 8 characters long';
    }

    // password password match
    if (password.length >= 8 && confirm.length >= 8 && password !== confirm) {
        MatchErrorPass.textContent = 'Password and confirm password do not match';
    }
}