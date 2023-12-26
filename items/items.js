var itemsDataList;
var itemsPerPage = 10;
var totalPages;
var currentPage = 1;
var start = 1;
var size = 10; // Assuming this is the default size for the first API call

function populateTable() {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    itemsDataList.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            window.location.href = `/item-details/item-details.html?id=${data.id}`;
            localStorageService.setItem('itemId', data.id);
        });

        const imageAndNameCell = createImageAndNameCell(data);
        row.appendChild(imageAndNameCell);

        const fieldsToDisplay = ['itemDescription', 'itemCode', 'weight', 'quantity'];
        fieldsToDisplay.forEach(field => {
            const cell = createTableCell(data[field]);
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

function createImageAndNameCell(data) {
    const imageAndNameCell = document.createElement('td');
    imageAndNameCell.classList.add('d-flex', 'gap-2', 'align-items-center');

    const image = createImageElement('https://currenwatches.com.pk/cdn/shop/products/wefew.jpg?v=1699506412');
    imageAndNameCell.appendChild(image);

    const nameSpan = document.createElement('span');
    nameSpan.textContent = data.itemName;
    imageAndNameCell.appendChild(nameSpan);

    return imageAndNameCell;
}

function createImageElement(src) {
    const image = document.createElement('img');
    image.src = src;
    image.alt = 'Item Image';
    image.classList.add('img-dimensions', 'rounded-pill');
    return image;
}

function createTableCell(text) {
    const cell = document.createElement('td');
    cell.textContent = text;
    return cell;
}



function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#itemsTableBody tr');
    let hasMatch = false;

    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)');
        const itemName = nameCell.textContent.toLowerCase();

        if (itemName.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
            hasMatch = true;
        } else {
            row.style.display = 'none';
        }
    });

    const noDataMessage = document.getElementById('noDataFound');
    const pagination = document.getElementById('paginationView');

    if (hasMatch) {
        noDataMessage.style.display = 'none';
        pagination.style.display = 'block';
    } else {
        noDataMessage.style.display = 'block';
        pagination.style.display = 'none';
    }
}

function generatePagination() {
    var paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = '';
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
    for (var i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
    }
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
}

function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        this.start = (currentPage - 1) * itemsPerPage + 1;
        getCustomersData();
    }
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchByName('');
    }
}

function logout() {
    localStorage.clear();
    window.location.href = '/auth/login/login.html';
}

function getItemsData(comingId) {
    apiService.getItems(start, size, comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                itemsDataList = response.data.items;
                totalPages = Math.ceil(response.data.totalData / itemsPerPage);
                populateTable();
                generatePagination();
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
function navigateBackToOrders() {
    window.location.href = '/orders/orders.html';
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
function logout() {
    localStorage.clear();
    window.location.href = '/auth/login/login.html';
}
function updateProfilePictures(response) {
    const profilePic = document.getElementById('profilePic');
    const profileIcon = document.getElementById('profileImg');
    const newImageUrl = response.pictureUrl; // Replace with the actual key in the response
    profilePic.src = newImageUrl;
    profileIcon.src = newImageUrl
}
window.onload = function () {
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';

    userDetails = JSON.parse(localStorageService.getItem('userDetail'));

    if (userDetails && userDetails.firstName) {
        document.getElementById('userName').innerText = userDetails.firstName;
    }

    if (userDetails && userDetails.firstName && userDetails.lastName) {
        document.getElementById('firstNameInput').value = userDetails.firstName;
        document.getElementById('lastNameInput').value = userDetails.lastName;
    }

    const id = window.location.href.split('=').reverse()[0];

    if (id.includes('=')) {
        getOrdersData(id);
    } else {
        const idFromLocalStorage = localStorage.getItem('orderId');
        getItemsData(idFromLocalStorage);
    }

    const userIdAsString = userDetails.id.toString();
    getUserDetail(userIdAsString);
};
