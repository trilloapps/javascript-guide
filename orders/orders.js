var orderDataList;
var itemsPerPage = 10;
var totalPages;
var currentPage = 1;
var start = 1;
var size = 10; // Assuming this is the default size for the first API call

function populateTable() {
    const tbody = document.getElementById('orderTableBody');
    tbody.innerHTML = ''; // Clear existing rows
    orderDataList.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            window.location.href = `/items/items.html?id=${data.id}`;
            localStorageService.setItem('orderId', data.id);;
        });

        // Define the fields you want to display
        const fieldsToDisplay = ['orderNo', 'title', 'description', 'bookingDateTime', 'deliverDateTime', 'status'];

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
        case 'shipped':
        case 'delivered':
            return 'text-bg-success';
        case 'Cancel':
            return 'text-bg-danger';
        case 'active':
        case 'pending':
            return 'text-bg-secondary';
        default:
            return 'text-bg-warning';
    }
}

function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#orderTableBody tr');
    let hasMatch = false;
    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(2)'); // Assuming the name is in the second column
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
        getOrdersData();
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

function getOrdersData(comingId) {
    apiService.getOrders(start, size, comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                orderDataList = response.data.orders;
                totalPages = Math.ceil(response.data.totalData / itemsPerPage);
                populateTable();
                generatePagination();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

function navigateBackToCustomers() {
    window.location.href = '/customers/customer.html';
}
window.onload = function () {
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';
    const id = window.location.href.split('=').reverse()[0]
    if (id.includes('=')) {
        getOrdersData(id);
    }
    else {
        const idFromLocalStorage = localStorage.getItem('customerId');
        getOrdersData(idFromLocalStorage);
    }
};