// Global Variables
var userDataList;
var selectedItem;
const itemsPerPage = 10;
let totalPages;
let currentPage = 1;
let start = 1;
let size = 15;

// Execute on window load
window.onload = function () {
    // Check access token before proceeding
    checkAccessToken();
    // Hide the "No Data Found" message by default
    const noDataMessage = document.getElementById('noDataFound');
    noDataMessage.style.display = 'none';

    // Fetch and display customer data
    getUsersData();
};

// Populate the customer table with data
function populateTable() {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    // Loop through customer data and create table rows
    userDataList.forEach(data => {
        const row = document.createElement('tr');
        row.addEventListener('click', () => handleRowClick(data));

        // Define fields to display in the table
        const fieldsToDisplay = ['userId', 'email', 'firstName', 'lastName', 'role', 'lastAccessTS', 'accessCount', 'inactive'];
        fieldsToDisplay.forEach(field => {
            const cell = document.createElement('td');
            cell.textContent = data[field];
            row.appendChild(cell);
            if (field === 'lastAccessTS' ) {
                // Check if the field is a timestamp and format it as a short date
                cell.textContent = formatShortDate(data[field]);
            }
        });

        // Create "Action" cell with dropdown menu
        const actionCell = document.createElement('td');
        actionCell.classList.add('dropdown-cell'); // Apply the CSS class for centering

        const dropdownDiv = document.createElement('div');
        dropdownDiv.classList.add('dropdown');

        const ellipsisIcon = document.createElement('i');
        ellipsisIcon.classList.add('fa-solid', 'fa-ellipsis-vertical');
        ellipsisIcon.setAttribute('role', 'button');
        ellipsisIcon.setAttribute('data-bs-toggle', 'dropdown');
        ellipsisIcon.setAttribute('aria-expanded', 'false');

        const dropdownMenu = document.createElement('ul');
        dropdownMenu.classList.add('dropdown-menu');

        // Create dropdown items for each option
        const editItem = createDropdownItem('Edit', () => openEditModal(data));
        const resetPasswordItem = createDropdownItem('Reset Password', () => openResetModal(data));
        const suspendItem = createDropdownItem(data.inactive?'Suspendl':'Resume', () => openSuspendModal(data));
        const deleteItem = createDropdownItem('Delete', () => openDeleteModal(data));

        dropdownMenu.appendChild(editItem);
        dropdownMenu.appendChild(resetPasswordItem);
        dropdownMenu.appendChild(suspendItem);
        dropdownMenu.appendChild(deleteItem);

        dropdownDiv.appendChild(ellipsisIcon);
        dropdownDiv.appendChild(dropdownMenu);
        actionCell.appendChild(dropdownDiv);

        row.appendChild(actionCell);

        tbody.appendChild(row);
    });
}
// Function to format a timestamp as a short date
function formatShortDate(timestamp) {
const options = { year: 'numeric', month: 'short', day: 'numeric' };
return new Date(timestamp).toLocaleDateString('en-US', options);
}

// Function to create a dropdown item
function createDropdownItem(label, onClickHandler) {
    const dropdownItem = document.createElement('li');
    const dropdownLink = document.createElement('a');
    dropdownLink.classList.add('dropdown-item');
    dropdownLink.textContent = label;
    dropdownLink.addEventListener('click', onClickHandler);
    dropdownItem.appendChild(dropdownLink);
    return dropdownItem;
}

// Example modal opening functions (replace with your modal logic)
function openEditModal(data) {
    console.log('Company Name:', data.companyName);
    selectedItem=data
    // Populate the form fields with user data
  console.log('Opening Suspend Modal for:', data);
  document.getElementById('userId').value = data.userId;
  document.getElementById('email').value = data.email;
  document.getElementById('firstName').value = data.firstName!=undefined ? data.firstName : 'N/A';
  document.getElementById('lastName').value = data.lastName!=undefined ? data.lastName : 'N/A';
  document.getElementById('role').value = data.role;
  document.getElementById('phone').value = data.mobilePhone!=undefined ? data.mobilePhone : 'N/A';
  document.getElementById('company').value = data.companyName!=undefined? data.companyName : 'N/A';
  document.getElementById('department').value = data.deptName!=undefined ? data.deptName : 'N/A';

  const readonlyFields = document.querySelectorAll('[readonly]');
readonlyFields.forEach(field => {
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.classList.add('readonly-dim-color');
    }
});

  // Show the modal
  var editModal = new bootstrap.Modal(document.getElementById('editModal'));
  editModal.show();
}
function openResetModal(data) {
    console.log('Opening Reset Password Modal for:', data);
    selectedItem = data;
    const userIdInput = document.getElementById('userID');
    userIdInput.value = selectedItem.userId; 
    const readonlyFields = document.querySelectorAll('[readonly]');
    readonlyFields.forEach(field => {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('readonly-dim-color');
        }
    });

    var changepassword = new bootstrap.Modal(document.getElementById('changepassword'));
    changepassword.show();
}


function openSuspendModal(data) {
    console.log('Opening Suspend Modal for:', data);
    selectedItem=data
     // Set the modal title and text based on the suspension status
  var modalTitle = document.getElementById('modal-basic-title');
  var suspendText = document.getElementById('suspendText');
  var suspendTextHeading = document.getElementById('suspendTextHeading');

  if (selectedItem.inactive === false) {
    modalTitle.textContent = 'Suspend';
    suspendTextHeading.textContent = 'Suspend';
    suspendText.textContent = "User '" + selectedItem.userId + "' will be suspended and wouldn't be able to login. Do you wish to continue?";
  } else if (selectedItem.inactive === true) {
    modalTitle.textContent = 'Resume';
    suspendTextHeading.textContent = 'Resume';
    suspendText.textContent = "User '" + selectedItem.userId + "' is suspended. This action will resume the user's login.";
  }

  // Show the modal
  var suspendModal = new bootstrap.Modal(document.getElementById('suspendModal'));
  suspendModal.show();
    // Add your logic to open the suspend modal
}

function openDeleteModal(data) {
    console.log('Opening Delete Modal for:', data);
    selectedItem=data
    var deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    deleteUserModal.show();
    // Add your logic to open the delete modal
}

// Handle row click event
function handleRowClick(data) {
    // Redirect to orders page with customer ID
    console.log('Opening Suspend Modal for:', data);
   
}
function saveChanges() {
    // Collect edited values
    const editedData = {
      userId: document.getElementById('userId').value,
      email: document.getElementById('email').value,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      role: document.getElementById('role').value,
      mobilePhone: document.getElementById('phone').value,
      companyName: document.getElementById('company').value,
      deptName: document.getElementById('department').value
      // Add more fields as needed
    };
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const firstNameValue = firstNameInput.value.trim();
    const lastNameValue = lastNameInput.value.trim();
    // Validate required fields
  if (!firstNameValue) {
    firstNameInput.classList.add('is-invalid');
    return; // Exit function if first name is empty
  } else {
    firstNameInput.classList.remove('is-invalid');
  }

  if (!lastNameValue) {
    lastNameInput.classList.add('is-invalid');
    return; // Exit function if last name is empty
  } else {
    lastNameInput.classList.remove('is-invalid');
  }
  
    // Update the data with edited values
    Object.assign(selectedItem, editedData); // Assuming 'data' is the existing user data object
  
    // Call the function to send the updated data via API
    editUsersData(selectedItem);
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
    const rows = document.querySelectorAll('#userTableBody tr');
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
        getUsersData();
    }

    // Clear search input and perform search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchByName('');
    }
}

// Fetch customer data from the API
function getUsersData() {
    let body={
        "className": "User",
        "start": start,
        "size": size,
        "orderBy": "userId"
    }
    apiService.getUsersDetails(body)
        .then(response => {
            if (response.status == 'failed') {
                console.log(response.message);
                showToast(response.message, 'danger');
            } else {
                // Update global customer data list and calculate total pages
                userDataList = response.items;
                totalPages = Math.ceil(response.totalItems / itemsPerPage);

                // Populate table and generate pagination links
                populateTable();
                generatePagination();
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

function editUsersData(body) {
    apiService.editUsersDetails(body)
      .then(response => {
        if (response.status == 'failed') {
          console.log(response.message);
          showToast(response.message, 'danger');
        } else {
          showToast(response.message, 'success');
          const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
          if (editModal) {
            editModal.hide();
          }
          getUsersData();
        }
      })
      .catch(error => {
        showToast(error.message, 'danger');
      });
  }
  function deleteUser(){
    apiService.deleteUsersDetails(selectedItem.id)
      .then(response => {
        if (response.status == 'failed') {
          console.log(response.message);
          showToast(response.message, 'danger');
        } else {
          showToast(response.message, 'success');
          const deleteUserModal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
          if (deleteUserModal) {
            deleteUserModal.hide();
          }
          getUsersData();
        }
      })
      .catch(error => {
        showToast(error.message, 'danger');
      });
  }
  function suspendOrResumeUser(){
    let body =
    {
      id: this.selectedItem.id,
      inactive: this.selectedItem.inactive === false ? true : false,
    }
    apiService.suspendUsersDetails(body)
      .then(response => {
        if (response.status == 'failed') {
          console.log(response.message);
          showToast(response.message, 'danger');
        } else {
          showToast(response.message, 'success');
          const suspendModal = bootstrap.Modal.getInstance(document.getElementById('suspendModal'));
          if (suspendModal) {
            suspendModal.hide();
          }
          getUsersData();
        }
      })
      .catch(error => {
        showToast(error.message, 'danger');
      });
  }
  function resetPassword(body){
    apiService.resetPassword(body)
      .then(response => {
        if (response.status == 'failed') {
          console.log(response.message);
          showToast(response.message, 'danger');
        } else {
          showToast(response.message, 'success');
          const changepassword = bootstrap.Modal.getInstance(document.getElementById('changepassword'));
          if (suspendModal) {
            changepassword.hide();
          }
          getUsersData();
        }
      })
      .catch(error => {
        showToast(error.message, 'danger');
      });
  }
  function resetpassword() {
    const newPasswordInput = document.getElementById('pass1').value;
    const repeatPasswordInput = document.getElementById('pass2').value;
  
    const newPasswordError = document.getElementById('newError');
    const confirmPasswordError = document.getElementById('confirmError');
    const passwordMatchError = document.getElementById('MatchError');
    console.log('New Password:', newPasswordInput);
    console.log('Repeat Password:', repeatPasswordInput);
    // Validate form inputs
    if (newPasswordInput=='') {
      newPasswordError.textContent = 'New password is required';
      return;
    } else {
      newPasswordError.textContent = '';
    }
  
    if (repeatPasswordInput=='') {
      confirmPasswordError.textContent = 'Confirm new password is required';
      return;
    } else {
      confirmPasswordError.textContent = '';
    }
    if (newPasswordInput.length < 8 ||repeatPasswordInput.length < 8 ) {
        newPasswordError.textContent = 'Password must be at least 8 characters long';
        return;
      } else {
        newPasswordError.textContent = '';
      }
  
    if (newPasswordInput !== repeatPasswordInput) {
      passwordMatchError.textContent = 'Password and confirm password do not match';
      return;
    } else {
      passwordMatchError.textContent = '';
    }

    const resetData = {
        password: newPasswordInput,
        rptPassword: repeatPasswordInput,
      };
    
      Object.assign(selectedItem, resetData);
    resetPassword(selectedItem)
  
}
function closemodal() {
    const newInput = document.getElementById('pass1');
    const repeatInput = document.getElementById('pass2');
    const newPasswordError = document.getElementById('newError');
    const confirmPasswordError = document.getElementById('confirmError');
    const passwordMatchError = document.getElementById('MatchError');
    
    newInput.value = '';  // Clear the value of the first input field
    repeatInput.value = '';  // Clear the value of the second input field
    newPasswordError.textContent = '';
    confirmPasswordError.textContent = '';
    passwordMatchError.textContent = '';
    
    const changepassword = bootstrap.Modal.getInstance(document.getElementById('changepassword'));
    if (changepassword) {
        changepassword.hide();
    }
}
function newUserModal() {
    // Get the modal element
    const modal = new bootstrap.Modal(document.getElementById('newUserModal'));
    modal.show();
     // Reset previous error messages
     const newp = document.getElementById('newp');
     const confirmp = document.getElementById('confirmp');
     const MatchErrorPass = document.getElementById('MatchErrorPass');
     const userIdError = document.getElementById('userIdError');
     const emailError = document.getElementById('emailError');
     const firstNameError = document.getElementById('firstNameError');
     const lastNameError = document.getElementById('lastNameError');
     const phoneNumberErr = document.getElementById('phoneNumberErr');

     // Set all values to empty strings
document.getElementById('userIdentification').value = '';
document.getElementById('rolenew').value = 'admin';
document.getElementById('useremail').value = '';
document.getElementById('phoneNumber').value = '';
document.getElementById('passinput1').value = '';
document.getElementById('passinput2').value = '';
document.getElementById('userfirstName').value = '';
document.getElementById('userlastName').value = '';
document.getElementById('company').value = '';
document.getElementById('department').value = '';
document.getElementById('phoneNumber').value = '';
      // Reset all error messages
    newp.textContent = '';
    confirmp.textContent = '';
    MatchErrorPass.textContent = '';
    userIdError.textContent = '';
    emailError.textContent = '';
    firstNameError.textContent = '';
    lastNameError.textContent = '';
    userIdError.textContent=''
    phoneNumberErr.textContent =''
}
function saveNewUserChanges() {

  // Reset previous error messages
  const newp = document.getElementById('newp');
  const confirmp = document.getElementById('confirmp');
  const MatchErrorPass = document.getElementById('MatchErrorPass');
  const userIdError = document.getElementById('userIdError');
  const emailError = document.getElementById('emailError');
  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');
  const phoneNumberErr = document.getElementById('phoneNumberErr');
  

 const userId = document.getElementById('userIdentification').value;
 const role = document.getElementById('rolenew').value;
 const email = document.getElementById('useremail').value;
 const phoneNo = document.getElementById('phoneNumber').value;
 const password = document.getElementById('passinput1').value;
 const confirm = document.getElementById('passinput2').value;
 const firstName = document.getElementById('userfirstName').value;
 const lastName = document.getElementById('userlastName').value;
 const company = document.getElementById('company').value;
 const department = document.getElementById('department').value;



 // Validate form inputs for required fields
 if (!userId) {
     userIdError.textContent = 'User ID is required';
 }
 if (!email) {
     emailError.textContent = 'Email is required';
 }
 if (!firstName) {
     firstNameError.textContent = 'First Name is required';
 }
 if (!lastName) {
     lastNameError.textContent = 'Last Name is required';
 }
 if (!phoneNo) {
     phoneNumberErr.textContent = 'Phone Number is required';
 }

 // Validate password length
 if (password.length < 8 ) {
     newp.textContent = 'Password must be at least 8 characters long';
 }
 if (confirm.length < 8) {
     confirmp.textContent = 'Confirm Password must be at least 8 characters long';
 }

 // password password match
 if (password.length >=8 && confirm.length >=8 && password !== confirm) {
     MatchErrorPass.textContent = 'Password and confirm password do not match';
 }
  // Construct the request body
  const requestBody = {
     userId: userId,
     role: role,
     email: email,
     phone: phoneNo,
     password: password,
     rptPassword: confirm,
     firstName: firstName,
     lastName: lastName,
     company: company,
     department: department
 };
 console.log(requestBody);


 if (
     newp.textContent === '' &&
     confirmp.textContent === '' &&
     MatchErrorPass.textContent === '' &&
     userIdError.textContent === '' &&
     emailError.textContent === '' &&
     firstNameError.textContent === '' &&
     lastNameError.textContent === '' &&
      phoneNumberErr.textContent ===''
 ) {
     apiService.newuser(requestBody)
     .then(response => {
       if (response.status == 'failed') {
         console.log(response.message);
         showToast(response.message, 'danger');
       } else {
         showToast(response.message, 'success');
         const newUserModal = bootstrap.Modal.getInstance(document.getElementById('newUserModal'));
         if (newUserModal) {
             newUserModal.hide();
         }
         getUsersData();
       }
     })
     .catch(error => {
       showToast(error.message, 'danger');
     });
 }


}




  