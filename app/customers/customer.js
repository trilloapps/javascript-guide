// Global Variables
var customerDataList;
const itemsPerPage = 10;
let totalPages;
let currentPage = 1;
let start = 1;
let size = 10;

// Execute on window load
window.onload = function () {
    // Check access token before proceeding
    checkAccessToken();
    // Hide the "No Data Found" message by default
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';

    // Fetch and display customer data
    getCustomersData();
};

// Populate the customer table with data
function populateTable() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = '';

    // Loop through customer data and create table rows
    customerDataList.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', () => handleRowClick(data));

        // Create and append cells for image and name
        row.appendChild(createImageAndNameCell(data));

        // Define fields to display in the table
        const fieldsToDisplay = ['email', 'phone', 'address', 'status'];
        fieldsToDisplay.forEach(field => {
            const cell = document.createElement('td');
            if (field === 'status') {
                // Create a badge for status field
                const badge = document.createElement('span');
                badge.textContent = data[field];
                badge.classList.add('badge','text-capital', getStatusBadgeClass(data[field]));
                cell.appendChild(badge);
            } else {
                // Display other fields as text content
                cell.textContent = data[field];
            }
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

// Create a cell for image and name
function createImageAndNameCell(data) {
    const imageAndNameCell = document.createElement('td');
    imageAndNameCell.classList.add('d-flex', 'gap-2', 'align-items-center');

    // Create and append image
    const image = document.createElement('img');
    image.src = data.profilePicture;
    image.alt = 'Item Image';
    image.classList.add('img-dimensions', 'rounded-pill');
    imageAndNameCell.appendChild(image);

    // Create and append name span
    const nameSpan = document.createElement('span');
    nameSpan.textContent = data.firstName + ' ' + data.lastName;
    imageAndNameCell.appendChild(nameSpan);

    return imageAndNameCell;
}

// Handle row click event
function handleRowClick(data) {
    // Redirect to orders page with customer ID
    const jsonString = JSON.stringify(data);
    window.location.href = `/app/orders/orders.html?id=${data.id}`;
    localStorageService.setItem('customerId', data.id);
}

// Get appropriate CSS class for status badge
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

// Search customers by name
function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#customerTableBody tr');
    let hasMatch = false;

    // Iterate through rows and show/hide based on search term
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

    // Show/hide "No Data Found" and pagination based on search results
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

// Generate pagination links
function generatePagination() {
    var paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = '';

    // Add previous page link
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';

    // Add page links
    for (var i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
    }

    // Add next page link
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
}

// Change the current page and fetch new data
function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        start = (currentPage - 1) * itemsPerPage + 1;
        getCustomersData();
    }

    // Clear search input and perform search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchByName('');
    }
}

// Fetch customer data from the API
function getCustomersData() {
    apiService.getCustomers(start, size)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                // Update global customer data list and calculate total pages
                customerDataList = response.data.customers;
                totalPages = Math.ceil(response.data.totalData / itemsPerPage);

                // Populate table and generate pagination links
                populateTable();
                generatePagination();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}
