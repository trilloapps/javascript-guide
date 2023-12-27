// Function to navigate back to the items page
function navigateBackToItems() {
    window.location.href = '/app/items/items.html';
}

// Function to get item details using the API service
function getItemsDetails(comingId) {
    apiService.getItemDetails(comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                // Update the UI with item details
                itemDetail = response.data;
                document.getElementById('itemName').textContent = itemDetail.itemName;
                document.getElementById('description').textContent = itemDetail.itemDescription;
                document.getElementById('itemCode').textContent = itemDetail.itemCode;
                document.getElementById('itemWeight').textContent = itemDetail.weight;
                document.getElementById('itemQuantity').textContent = itemDetail.quantity;
                document.getElementById('itemPic').src = itemDetail.picture;
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

// Function to update the modal with item details
function updateModal() {
    document.getElementById('itemCode1').value = itemDetail.itemCode;
    document.getElementById('itemWeight1').value = itemDetail.weight;
    document.getElementById('itemQuantity1').value = itemDetail.quantity;
}

// Event listener for when the item modal is shown
document.getElementById('itemModal').addEventListener('shown.bs.modal', function () {
    updateModal();
});

// Event listener for input changes in itemQuantity1
itemQuantity1.addEventListener('input', function () {
    // Clear the validation message when the user starts typing
    quantityError.textContent = '';
});

// Function to handle save button click
function saveItem() {
    const data = {
        lineItemId: itemDetail.id.toString(), // Replace with the actual itemId
        quantity: document.getElementById('itemQuantity1').value
    };

    var quantityInput = document.getElementById('itemQuantity1');
    var quantityError = document.getElementById('quantityError');

    if (!quantityInput.value || isNaN(quantityInput.value) || parseFloat(quantityInput.value) === 0) {
        // Show a validation message for an empty or invalid quantity
        quantityError.textContent = 'Quantity is required and must be a valid number.';
        quantityError.classList.add('text-danger');
        return; // Stop execution if the quantity is not valid
    }

    // Send itemId and updatedQuantity to your backend or perform other actions
    apiService.editLineItem(data)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                // Update the UI with the new item details
                itemDetail = response.data;
                document.getElementById('itemName').textContent = itemDetail.itemName;
                document.getElementById('description').textContent = itemDetail.itemDescription;
                document.getElementById('itemCode').textContent = itemDetail.itemCode;
                document.getElementById('itemWeight').textContent = itemDetail.weight;
                document.getElementById('itemQuantity').textContent = itemDetail.quantity;
                document.getElementById('itemPic').src = itemDetail.picture;
                showToast(response.message, 'success');
                closeModal();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

// Function to close the modal
function closeModal() {
    var modal = document.getElementById('itemModal');
    var modalInstance = bootstrap.Modal.getInstance(modal);

    // Close the modal
    if (modalInstance) {
        modalInstance.hide();
    }
}

// Call the function to check access token and get item details when the window has finished loading
window.onload = function () {
    checkAccessToken();
    // Get the item ID from the URL
    const id = window.location.href.split('=').reverse()[0];
    console.log('hererer', id);
    if (id) {
        getItemsDetails(id);
    }
};
