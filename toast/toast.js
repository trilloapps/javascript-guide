// Function to show a Bootstrap toast notification
function showToast(message, type) {
    // Create a container for the toast
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast align-items-center text-white border-0 position-absolute top-0 start-50 translate-middle-x bg-${type}`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'assertive');
    toastContainer.setAttribute('aria-atomic', 'true');
    toastContainer.style.top = '5px';

    // Create a div for the toast content
    const toastContent = document.createElement('div');
    toastContent.className = 'd-flex';

    // Create a div for the toast body (actual message)
    const toastBody = document.createElement('div');
    toastBody.className = 'toast-body';
    toastBody.textContent = message;

    // Create a close button for the toast
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close btn-close-white me-2 m-auto';
    closeButton.setAttribute('data-bs-dismiss', 'toast');
    closeButton.setAttribute('aria-label', 'Close');

    // Assemble the toast content
    toastContent.appendChild(toastBody);
    toastContent.appendChild(closeButton);
    toastContainer.appendChild(toastContent);

    // Append the toast container to the body
    document.body.appendChild(toastContainer);

    // Create a Bootstrap Toast instance and show it
    const bootstrapToast = new bootstrap.Toast(toastContainer);
    bootstrapToast.show();

    // Automatically hide the toast after 3000 milliseconds (3 seconds)
    setTimeout(() => {
        bootstrapToast.hide();
    }, 3000);
}
