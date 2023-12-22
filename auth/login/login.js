function LoginSubmitForm() {
    console.log("herrer");
    // Get values from the form
    const userId = document.getElementById('userId').value;
    const password = document.getElementById('password').value;

    // Make the login API call
    apiService.login(userId, password)
        .then(response => {
            // Check if the response indicates success
            if (response.status=='connected') {
                // Store user information and access token in local storage
                localStorageService.setItem('userDetail', JSON.stringify(response.user));
                localStorageService.setItem('accessToken', response.accessToken);;

                // Optionally, redirect to a new page or perform other actions upon successful login
                console.log('Login successful. Redirecting to the dashboard...');
                window.location.href = '/customers/customer.html'; // Change the URL as needed
            } else {
                console.log(response.message);
                showToast(response.message,'danger');
                // Display an error message if the login was not successful
                console.error('Login failed. Error:', response.message);
            }
        })
        .catch(error => {
            // Handle network or other errors
            showToast(error.message,'danger');
        });
}
function showToast(message, type) {
    // Create the toast container
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast align-items-center text-white border-0 position-absolute top-0 start-50 translate-middle-x bg-${type}`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'assertive');
    toastContainer.setAttribute('aria-atomic', 'true');

    // Add 5px top margin
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



