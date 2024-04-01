// Global variables
var orderDataList;
var itemsPerPage = 10;
var totalPages;
var currentPage = 1;
var start = 1;
var size = 10; // Default size for the first API call

// Function to populate the table with order data
// Function to populate the table with order data
function populateTable() {
    // Get the table body element
    const tbody = document.getElementById('orderTableBody');
    // Clear existing rows
    tbody.innerHTML = '';

    // Loop through order data to create rows
    orderDataList.forEach(data => {
        const row = createTableRow(data);
        // Append the created row to the table body
        tbody.appendChild(row);
    });
}

// Function to create a table row for order data
function createTableRow(data) {
    // Create a table row element
    const row = document.createElement('tr');
    // Add a click event listener to redirect to the items page
    row.addEventListener('click', function () {
        redirectToItemsPage(data.id);
    });

    // Define the fields to display in the table
    const fieldsToDisplay = ['orderNo', 'title', 'description', 'bookingDateTime', 'deliverDateTime', 'status'];
    // Create and append cells for each field
    fieldsToDisplay.forEach(field => {
        const cell = createTableCell(field, data);
        row.appendChild(cell);
    });

    return row;
}

// Function to redirect to the items page with the specified order ID
function redirectToItemsPage(orderId) {
    window.location.href = `/app/items/items.html?id=${orderId}`;
    localStorageService.setItem('orderId', orderId);
}

// Function to create a table cell based on the field and data
function createTableCell(field, data) {
    const cell = document.createElement('td');

    if (field === 'bookingDateTime' || field === 'deliverDateTime') {
        // Check if the field is a timestamp and format it as a short date
        cell.textContent = formatShortDate(data[field]);
    } else if (field === 'status') {
        const badge = createStatusBadge(data[field]);
        cell.appendChild(badge);
    } else {
        cell.textContent = data[field];
    }

    return cell;
}
// Function to format a timestamp as a short date
function formatShortDate(timestamp) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(timestamp*1000).toLocaleDateString('en-US', options);
}

// Function to create a status badge element based on the status value
function createStatusBadge(status) {
    const badge = document.createElement('span');
    // Set the text content of the badge to the status value
    badge.textContent = status;
    // Add the 'badge' class and determine the appropriate class based on the status
    badge.classList.add('badge','text-capital', getStatusBadgeClass(status));
    return badge;
}


// Function to determine the badge class based on order status
function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'delivered':
            return 'text-bg-success';
        case 'cancel':
            return 'text-bg-danger';
        case 'pending':
            return 'text-bg-secondary';
        case 'shipped':
            return 'text-bg-info';
        default:
            return 'text-bg-warning';
    }
}

// Function to search orders by name
function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#orderTableBody tr');
    let hasMatch = false;

    // Iterate through rows and display/hide based on search term
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

    // Show/hide no data message and pagination based on search results
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

// Function to generate pagination
function generatePagination() {
    var paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = '';

    // Add 'Previous' button
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';

    // Add page number buttons
    for (var i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
    }

    // Add 'Next' button
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
}

// Function to change the current page
function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        start = (currentPage - 1) * itemsPerPage + 1;
        getOrdersData();
    }

    // Clear search input and perform search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchByName('');
    }
}

// Function to get order data
function getOrdersData(comingId) {
    apiService.getOrders(start, size, comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                // Update global orderDataList and calculate total pages
                orderDataList = response.data.orders;
                totalPages = Math.ceil(response.data.totalData / itemsPerPage);
                // Populate table and generate pagination
                populateTable();
                generatePagination();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

// Function to navigate back to customers page
function navigateBackToCustomers() {
    window.location.href = '/app/customers/customer.html';
}

// Execute on window load
window.onload = function () {
    // Check user access token
    checkAccessToken();

    // Hide no data message by default
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';

    // Extract ID from URL
    const id = window.location.href.split('=').reverse()[0];

    // Check if ID includes '=' and call getOrdersData with the ID, else get ID from local storage
    if (id.includes('=')) {
        getOrdersData(id);
    } else {
        const idFromLocalStorage = localStorage.getItem('customerId');
        getOrdersData(idFromLocalStorage);
    }
};
