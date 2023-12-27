
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userIdError = document.getElementById('userIdError');
const passwordError = document.getElementById('passwordError');
userIdError.classList.add('text-danger');
passwordError.classList.add('text-danger');
userIdInput.addEventListener('input', clearValidationMessage);
passwordInput.addEventListener('input', clearValidationMessage);

function clearValidationMessage() {
    userIdError.innerText = "";
    passwordError.innerText = "";
}

// Validate user input
function validateInputs() {
    const userId = userIdInput.value.trim();
    const password = passwordInput.value.trim();

    if (!userId && !password) {
        userIdError.innerHTML = "User ID is required.";
        passwordError.innerHTML = "Password is required.";
        return false;
    }

    if (!userId) {
        userIdError.innerHTML = "User ID is required.";
        return false;
    }

    if (!password) {
        passwordError.innerHTML = "Password is required.";
        return false;
    }

    return true;
}
function LoginSubmitForm() {
    if (validateInputs()) {
        const userId = userIdInput.value
        const password = passwordInput.value
        apiService.login(userId, password)
        .then(response => {
            if (response.status=='connected') {
                localStorageService.setItem('userDetail', JSON.stringify(response.user));
                localStorageService.setItem('accessToken', response.accessToken);;
                window.location.href = '/customers/customer.html';
            } else {
                console.log(response.message);
                showToast(response.message,'danger');
            }
        })
        .catch(error => {
            showToast(error.message,'danger');
        });
    }
}



