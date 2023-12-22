const exampleData = [
    {orderNo: 'o-456', title: 'Smartphone', description: 'High-end mobile device', bookingDate: getRandomDate(), deliveryTime: '2 days', status: 'Pending'},
    {orderNo: 'o-457', title: 'Laptop', description: 'Powerful laptop for productivity', bookingDate: getRandomDate(), deliveryTime: '4 days', status: 'Delivered'},
    {orderNo: 'o-458', title: 'Smartwatch', description: 'Fitness and health tracking', bookingDate: getRandomDate(), deliveryTime: '1 day', status: 'Pending'},
    {orderNo: 'o-459', title: 'Headphones', description: 'Premium audio experience', bookingDate: getRandomDate(), deliveryTime: '3 days', status: 'In Transit'},
    {orderNo: 'o-460', title: 'Camera', description: 'High-resolution digital camera', bookingDate: getRandomDate(), deliveryTime: '5 days', status: 'Cancel'},
    {orderNo: 'o-461', title: 'Tablet', description: 'Portable computing device', bookingDate: getRandomDate(), deliveryTime: '2 days', status: 'In Transit'},
    {orderNo: 'o-462', title: 'Smart Speaker', description: 'Voice-controlled home assistant', bookingDate: getRandomDate(), deliveryTime: '3 days', status: 'In Transit'}

    // Add more data objects as needed
];
function getRandomDate() {
    const currentDate = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30); // Adjust the range as needed
    currentDate.setDate(currentDate.getDate() - randomDaysAgo);

    // Format the date to a human-readable string
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
    return currentDate.toLocaleString('en-US', options);
}

// Function to create table rows dynamically
function populateTable() {
    const tbody = document.getElementById('orderTableBody');
    exampleData.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', function () {
            // You can handle the click event here, for example, log the customer's ID
            window.location.href = `/items/items.html?id=${data.orderNo}`;
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
function navigateBackToCustomers() {
    window.location.href = '/customers/customer.html';
}

function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
            case 'delivered':
                return 'text-bg-success';
            case 'cancel':
                return 'text-bg-danger';
            case 'in transit':
                return 'text-bg-warning';
            default:
                return 'text-bg-secondary';
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

// Call the function to populate the table when the window has finished loading
window.onload = function () {
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none'; // Hide the message if there is a match
    populateTable();
};