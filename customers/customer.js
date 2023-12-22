const exampleData = [
    { id: 1, name: 'John', email: 'john.doe@example.com', phone: '(555) 123-4567', address: '123 Main St, City', status: 'Active' },
    { id: 2, name: 'Jane',  email: 'jane.smith@example.com', phone: '(555) 987-6543', address: '456 Oak St, Town', status: 'Inactive' },
    { id: 3, name: 'Jane',  email: 'jane.smith@example.com', phone: '(555) 987-6543', address: '456 Oak St, Town', status: 'Inactive' },
    { id: 4, name: 'Jane',  email: 'jane.smith@example.com', phone: '(555) 987-6543', address: '456 Oak St, Town', status: 'Inactive' },
    { id: 5, name: 'Jane',  email: 'jane.smith@example.com', phone: '(555) 987-6543', address: '456 Oak St, Town', status: 'Inactive' },
    { id: 6, name: 'Jane',  email: 'jane.smith@example.com', phone: '(555) 987-6543', address: '456 Oak St, Town', status: 'Inactive' },
    { id: 7, name: 'Jane',  email: 'jane.smith@example.com', phone: '(555) 987-6543', address: '456 Oak St, Town', status: 'Inactive' }
    // Add more data objects as needed
];
var itemsPerPage = 5;
var totalPages = Math.ceil(exampleData.length / itemsPerPage);
var currentPage = 1;

// Function to create table rows dynamically
function populateTable() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = ''; // Clear existing rows
    // Calculate the range of items to display for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = exampleData.slice(startIndex, endIndex);
    currentItems.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            // You can handle the click event here, for example, log the customer's ID
            window.location.href = `/orders/orders.html?id=${data.id}`;
        });
        Object.keys(data).forEach(key => {
            const cell = document.createElement('td');
            if (key === 'status') {
                // For the 'status' key, create a custom badge with a click event listener
                const badge = document.createElement('span');
                badge.textContent = data[key];
                badge.classList.add('badge', getStatusBadgeClass(data[key]));
                cell.appendChild(badge);
            } else {
                // For other keys, create regular cells
                cell.textContent = data[key];
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
        const nameCell = row.querySelector('td:nth-child(2)'); // Assuming the name is in the second column
        const itemName = nameCell.textContent.toLowerCase();

        if (itemName.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
            hasMatch = true; // Show the row if the name matches the search term
        } else {
            row.style.display = 'none'; // Hide the row if the name does not match
        }
    });
    const noDataMessage = document.getElementById('noDataFound');
    if (hasMatch) {
        noDataMessage.style.display = 'none'; // Hide the message if there is a match
    } else {
        noDataMessage.style.display = 'block'; // Show the message if there is no match
    }
}
function generatePagination() {
    var paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = '';
    // Add "Previous" button
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
    // Add page numbers
    for (var i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
    }
    // Add "Next" button
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
}

function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        populateTable();
        generatePagination();

        // Add logic here to fetch and display data for the new page
        // You can make an AJAX request to load the content dynamically
    }
}

// Call the function to populate the table when the window has finished loading
window.onload = function () {
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none'; // Hide the message if there is a match
    populateTable();
    generatePagination();
};