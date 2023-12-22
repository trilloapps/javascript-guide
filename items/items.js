const exampleData = [
    {image:'https://currenwatches.com.pk/cdn/shop/products/wefew.jpg?v=1699506412', name:'Watch', description:'A watch is a timekeeping device typically worn on the wrist',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://i.insider.com/5bb239558cec63a8528b456a?width=1000&format=jpeg&auto=webp', name:'Mobile Stand', description:'Phone stand or holder, is a device designed to securely hold and display mobile phones',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://img.buzzfeed.com/buzzfeed-static/static/2019-10/13/19/asset/af762d042c03/sub-buzz-4272-1570995140-4.jpg', name:'Bottle Opener', description:'A bottle opener is a simple yet essential tool designed to remove metal caps or lids from bottles',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://img.buzzfeed.com/buzzfeed-static/static/2019-10/13/20/asset/622518a5553a/sub-buzz-8606-1570996986-1.jpg?downsize=900:*&output-format=auto&output-quality=auto', name:'Kitchen Brush', description:' kitchen brush is a versatile cleaning tool designed specifically for use in the kitchen. ',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://dmdailydeals.com/cdn/shop/files/S7689ac8351254dedb584f386073ad8b13.webp?v=1701630030&width=533', name:'Clothes Hanger', description:'A clothes hanger, also simply known as a hanger, is a device used to hang and organize clothing',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://images-na.ssl-images-amazon.com/images/I/61Q5isxviYL.jpg', name:'Dustbin', description:'Dustbin, also commonly known as a trash can or garbage bin',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://www.familyhandyman.com/wp-content/uploads/2021/08/GettyImages-679968229-e1630349408564.jpg?fit=700%2C700', name:'Brush Cup', description:'A brush cup, often known as a makeup brush holder or organizer',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkozEd70rt6cB4xT2FpGHMy36QQtw9V7Z73HToG2IYIkIXSP_Jsf-FCIaJqMgNgvcrWAw&usqp=CAU', name:'Sugar Pot', description:'A sugar pot, also known as a sugar bowl, is a container specifically designed for storing and serving sugar',  code:'fd-45486', weight:'50g', quantity:'3'},
    {image:'https://bestlifeonline.com/wp-content/uploads/sites/3/2018/02/Razor.jpg?quality=82&strip=all', name:'Safety Razor', description:'A safety razor is a type of razor designed for shaving facial or body hair.',  code:'fd-45486', weight:'50g', quantity:'3'},

    // Add more data objects as needed
];
var itemsPerPage = 5;
var totalPages = Math.ceil(exampleData.length / itemsPerPage);
var currentPage = 1;

// Function to create table rows dynamically
function populateTable() {
    const tbody = document.getElementById('itemsTableBody');
    tbody.innerHTML = ''; // Clear existing rows
    // Calculate the range of items to display for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = exampleData.slice(startIndex, endIndex);
    currentItems.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            // You can handle the click event here, for example, log the customer's ID
            const jsonString = JSON.stringify(data);
            localStorage.setItem('itemData', jsonString);
            window.location.href = `/item-details/item-details.html?=${data.name}`;
        });

        // Create a cell for the image and name
        const imageAndNameCell = document.createElement('td');
        imageAndNameCell.classList.add('d-flex','gap-2','align-items-center')
        // Create an image element
        const image = document.createElement('img');
        image.src = data.image;
        image.alt = 'Item Image'; // Provide alternative text for accessibility
        image.classList.add('img-dimensions','rounded-pill') // Set the height to 40px (adjust as needed)
        imageAndNameCell.appendChild(image);

        // Create a span for the name
        const nameSpan = document.createElement('span');
        nameSpan.textContent = data.name;
        imageAndNameCell.appendChild(nameSpan);

        // Append the combined cell to the row
        row.appendChild(imageAndNameCell);

        // Create cells for other data
        Object.keys(data).forEach(key => {
            if (key !== 'image' && key !== 'name') {
                const cell = document.createElement('td');
                cell.textContent = data[key];
                row.appendChild(cell);
            }
        });

        tbody.appendChild(row);
    });
}
function navigateBackToOrders() {
    window.location.href = '/orders/orders.html';
}
function searchByName(searchTerm) {
    const rows = document.querySelectorAll('#itemsTableBody tr');
    let hasMatch = false;
    rows.forEach(row => {
        const nameCell = row.querySelector('td:nth-child(1)'); // Assuming the name is in the second column
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