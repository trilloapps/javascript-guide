

// Function to create table rows dynamically
var itemDetail;
function navigateBackToItems() {
    window.location.href = '/items/items.html';
}
function getItemsDetails(comingId) {
    apiService.getItemDetails(comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                itemDetail = response.data;
                document.getElementById('itemName').textContent = itemDetail.itemName;
                document.getElementById('description').textContent = itemDetail.itemDescription;
                document.getElementById('itemCode').textContent = itemDetail.itemCode;
                document.getElementById('itemWeight').textContent = itemDetail.weight;
                document.getElementById('itemQuantity').textContent = itemDetail.quantity;
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}
function updateModal() {
    document.getElementById('itemCode1').value = itemDetail.itemCode;
    document.getElementById('itemWeight1').value = itemDetail.weight;
    document.getElementById('itemQuantity1').value = itemDetail.quantity;
}
document.getElementById('itemModal').addEventListener('shown.bs.modal', function () {
    updateModal();
});
itemQuantity1.addEventListener('input', function () {
    // Clear the validation message when the user starts typing
    quantityError.textContent = '';
});
// Function to handle save button click
function saveItem() {

    const data =
    {
        lineItemId: itemDetail.id.toString(),// Replace with the actual itemId
        quantity: document.getElementById('itemQuantity1').value

    }
    var quantityInput = document.getElementById('itemQuantity1');
    var quantityError = document.getElementById('quantityError');
    if (!quantityInput.value || isNaN(quantityInput.value) || parseFloat(quantityInput.value) === 0) {
        // Show a validation message for an empty or invalid quantity
        quantityError.textContent = 'Quantity is required and must be a valid number.';
        quantityError.classList.add('text-danger')
        return; // Stop execution if the quantity is not valid
    }
    // Send itemId and updatedQuantity to your backend or perform other actions
    apiService.editLineItem(data)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                itemDetail = response.data
                document.getElementById('itemName').textContent = itemDetail.itemName;
                document.getElementById('description').textContent = itemDetail.itemDescription;
                document.getElementById('itemCode').textContent = itemDetail.itemCode;
                document.getElementById('itemWeight').textContent = itemDetail.weight;
                document.getElementById('itemQuantity').textContent = itemDetail.quantity;
                showToast(response.message, 'success');
                closeModal();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });

    // Close the modal (you can use the appropriate method based on your modal library)
}
function closeModal() {
    var modal = document.getElementById('itemModal');
    var modalInstance = bootstrap.Modal.getInstance(modal);

    // Close the modal
    if (modalInstance) {
        modalInstance.hide();
    }
}
function getUserDetail(comingId) {
    apiService.getUserDetail(comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                updateProfilePictures(response.data[0])
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}


function showToast(message, type) {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast align-items-center text-white border-0 position-absolute top-0 start-50 translate-middle-x bg-${type}`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'assertive');
    toastContainer.setAttribute('aria-atomic', 'true');
    toastContainer.style.top = '5px';

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

    toastContent.appendChild(toastBody);
    toastContent.appendChild(closeButton);
    toastContainer.appendChild(toastContent);

    document.body.appendChild(toastContainer);

    const bootstrapToast = new bootstrap.Toast(toastContainer);
    bootstrapToast.show();

    setTimeout(() => {
        bootstrapToast.hide();
    }, 3000);
}
async function handleFileUpload(e) {
    const fileInput = e.target;
    let functionParam = {
        userId: userDetails.id
    }
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('folder', 'public/images');
    formData.append('makePublic', true);
    formData.append('functionName', 'AddUserImage');
    formData.append('functionParam', JSON.stringify(functionParam));
    try {
        // Assuming you have an apiService with an uploadImage method
        const response = await apiService.uploadImage(formData);

        // Update the image source if the upload is successful
        if (response) {
            const profilePic = document.getElementById('profilePic');
            const profileIcon = document.getElementById('profileImg');
            const newImageUrl = response.pictureUrl; // Replace with the actual key in the response
            profilePic.src = newImageUrl;
            profileIcon.src = newImageUrl
        } else {
            showToast(response.message, 'danger');
        }
    } catch (error) {
        showToast(error.message, 'danger');
    }
}
function updateProfilePictures(response) {
    const profilePic = document.getElementById('profilePic');
    const profileIcon = document.getElementById('profileImg');
    const newImageUrl = response.pictureUrl; // Replace with the actual key in the response
    profilePic.src = newImageUrl;
    profileIcon.src = newImageUrl
}
function logout() {
    localStorage.clear();
    window.location.href = '/auth/login/login.html';
}
// Call the function to populate the table when the window has finished loading
window.onload = function () {
    userDetails = JSON.parse(localStorageService.getItem('userDetail'))
    if (userDetails && userDetails.firstName) {
        document.getElementById('userName').innerText = userDetails.firstName;
    }
    if (userDetails && userDetails.firstName && userDetails.lastName) {
        document.getElementById('firstNameInput').value = userDetails.firstName;
        document.getElementById('lastNameInput').value = userDetails.lastName;
    }
    // Perform actions with the data
    const id = window.location.href.split('=').reverse()[0]
    console.log('hererer', id);
    if (id) {
        getItemsDetails(id);
    }
    var userIdAsString = userDetails.id.toString();

    // Now, you can pass userIdAsString to the getUserDetail function
    getUserDetail(userIdAsString);
};