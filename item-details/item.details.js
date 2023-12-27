

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



// Call the function to populate the table when the window has finished loading
window.onload = function () {
    // Perform actions with the data
    const id = window.location.href.split('=').reverse()[0]
    console.log('hererer', id);
    if (id) {
        getItemsDetails(id);
    }
};