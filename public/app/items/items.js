// Variables for item data, pagination, and page information
var itemsDataList;
var itemsPerPage = 10;
var totalPages;
var currentPage = 1;
var start = 1;
var size = 10; // Assuming this is the default size for the first API call

// Function to populate the table with item data
function populateTable() {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    itemsDataList.forEach(data => {
        const row = document.createElement('tr');
        // Event listener to navigate to item details page on row click
        row.addEventListener('click', function () {
            window.location.href = `/app/item-details/item-details.html?id=${data.id}`;
            localStorageService.setItem('itemId', data.id);
        });

        // Create and append cells for image and name
        const imageAndNameCell = createImageAndNameCell(data);
        row.appendChild(imageAndNameCell);

        // Fields to display in the table
        const fieldsToDisplay = ['itemDescription', 'itemCode', 'weight', 'quantity'];
        // Create and append cells for other fields
        fieldsToDisplay.forEach(field => {
            const cell = createTableCell(data[field]);
            row.appendChild(cell);
        });

        // Append the row to the table body
        tbody.appendChild(row);
    });
}

// Function to create cell for image and name
function createImageAndNameCell(data) {
    const imageAndNameCell = document.createElement('td');
    imageAndNameCell.classList.add('d-flex', 'gap-2', 'align-items-center');

    // Create and append image element
    const image = createImageElement(data.picture);
    imageAndNameCell.appendChild(image);

    // Create and append name span
    const nameSpan = document.createElement('span');
    nameSpan.textContent = data.itemName;
    imageAndNameCell.appendChild(nameSpan);

    return imageAndNameCell;
}

// Function to create image element
function createImageElement(src) {
    const image = document.createElement('img');
    image.src = src;
    image.alt = 'Item Image';
    image.classList.add('img-dimensions', 'rounded-pill');
    return image;
}

// Function to create a table cell with text content
function createTableCell(text) {
    const cell = document.createElement('td');
    const truncatedText = truncateText(text, 60);
    cell.textContent = truncatedText;
    return cell;
}
// Function to truncate a table cell 
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}

// Function to search items by name and filter the table
function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#itemsTableBody tr');
    let hasMatch = false;

    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)');
        const itemName = nameCell.textContent.toLowerCase();

        // Show or hide rows based on the search term
        if (itemName.includes(searchTerm.toLowerCase())) {
            row.style.display = '';
            hasMatch = true;
        } else {
            row.style.display = 'none';
        }
    });

    // Show or hide the no data message and pagination based on search results
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

// Function to generate pagination links
function generatePagination() {
    var paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = '';
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage - 1) + ')" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
    for (var i = 1; i <= totalPages; i++) {
        paginationElement.innerHTML += '<li class="page-item ' + (currentPage === i ? 'active' : '') + '"><a class="page-link" href="#" onclick="changePage(' + i + ')">' + i + '</a></li>';
    }
    paginationElement.innerHTML += '<li class="page-item"><a class="page-link" href="#" onclick="changePage(' + (currentPage + 1) + ')" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
}

// Function to handle page change in pagination
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

// Function to get item data based on order or from local storage
function getItemsData(comingId) {
    apiService.getItems(start, size, comingId)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                itemsDataList = response.data.items;
                totalPages = Math.ceil(response.data.totalData / itemsPerPage);
                // Populate the table and generate pagination links
                populateTable();
                generatePagination();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

// Function to navigate back to orders page
function navigateBackToOrders() {
    window.location.href = '/app/orders/orders.html';
}

// Execute these actions when the window has finished loading
window.onload = function () {
    // Check if the user is authenticated
    checkAccessToken();
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';

    // Get the order or item ID from the URL
    const id = window.location.href.split('=').reverse()[0];

    // Check if the ID is for an order or an item and call the corresponding function
    if (id.includes('=')) {
        getOrdersData(id);
    } else {
        const idFromLocalStorage = localStorage.getItem('orderId');
        getItemsData(idFromLocalStorage);
    }
};
