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

function navigateBackToOrders() {
    window.location.href = '/orders/orders.html';
}
window.onload = function () {
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';

    const id = window.location.href.split('=').reverse()[0];

    if (id.includes('=')) {
        getOrdersData(id);
    } else {
        const idFromLocalStorage = localStorage.getItem('orderId');
        getItemsData(idFromLocalStorage);
    }
};
