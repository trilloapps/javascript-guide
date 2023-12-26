
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
function showToast(message, type) {
    // Create the toast container
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast align-items-center text-white border-0 position-absolute top-0 start-50 translate-middle-x bg-${type}`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'assertive');
    toastContainer.setAttribute('aria-atomic', 'true');
    toastContainer.style.top = '5px';

    // Create the toast content
    const toastContent = document.createElement('div');
    toastContent.className = 'd-flex';

    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');

    // Append elements
    toastContent.appendChild(toastBody);
    toastContent.appendChild(closeButton);
    toastContainer.appendChild(toastContent);

    // Append toast to the body
    document.body.appendChild(toastContainer);

    // Initialize Bootstrap Toast
    const bootstrapToast = new bootstrap.Toast(toastContainer);

    // Show the toast
    bootstrapToast.show();

    // Automatically dismiss the toast after 3 seconds
    setTimeout(() => {
        bootstrapToast.hide();
    }, 3000);
}



