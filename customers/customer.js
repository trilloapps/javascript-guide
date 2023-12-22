var customerDataList;
var itemsPerPage = 10;
var totalPages;
var currentPage = 1;
var start = 1;
var size = 10; // Assuming this is the default size for the first API call

function populateTable() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = ''; // Clear existing rows
    customerDataList.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            const jsonString = JSON.stringify(data);
            window.location.href = `/orders/orders.html?=${data.id}`;
        });

        // Define the fields you want to display
        const fieldsToDisplay = ['email', 'phone', 'address', 'status'];

        // Create a cell for the image and name
        const imageAndNameCell = document.createElement('td');
        imageAndNameCell.classList.add('d-flex', 'gap-2', 'align-items-center');

        // Create an image element
        const image = document.createElement('img');
        image.src = data.profilePicture;
        image.alt = 'Item Image';
        image.classList.add('img-dimensions', 'rounded-pill');
        imageAndNameCell.appendChild(image);

        // Create a span for the name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = data.firstName + ' ' + data.lastName;
        imageAndNameCell.appendChild(nameSpan);

        // Append the combined cell to the row
        row.appendChild(imageAndNameCell);

        // Create cells for other specified data
        fieldsToDisplay.forEach(field => {
            const cell = document.createElement('td');
            if (field === 'status') {
                const badge = document.createElement('span');
                badge.textContent = data[field];
                badge.classList.add('badge', getStatusBadgeClass(data[field]));
                cell.appendChild(badge);
            } else {
                cell.textContent = data[field];
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}


function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'active':
            return 'text-bg-success';
        case 'inactive':
            return 'text-bg-danger';
        // Add more cases as needed
        default:
            return 'badge-light';
    }
}

function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#customerTableBody tr');
    let hasMatch = false;
    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)'); // Assuming the name is in the second column
        const itemName = nameCell.textContent.toLowerCase();

        if (itemName.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
            hasMatch = true;
        } else {
            row.style.display = 'none';
        }
    });
    const noDataMessage = document.getElementById('noDataFound');
    if (hasMatch) {
        noDataMessage.style.display = 'none';
    } else {
        noDataMessage.style.display = 'block';
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

function getCustomersData() {
    apiService.getCustomers(start, size)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                customerDataList = response.data.customers;
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

window.onload = function () {
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';
    getCustomersData();
};
