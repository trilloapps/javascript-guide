// Global variable to store user details
let userDetails;

// Function to log out the user
function logout() {
    localStorage.clear(); // Clear local storage
    window.location.href = '/auth/login/login.html'; // Redirect to login page
}

// Function to get user details by ID
function getUserDetail(comingId) {
    apiService.getUserDetail(comingId)
        .then(response => {
            if (response.status === 'failed') {
                showToast(response.message, 'danger');
            } else {
                updateProfilePictures(response.data);
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

// Function to handle file upload
async function handleFileUpload(e) {
    const fileInput = e.target;
    const functionParam = {
        userId: userDetails.id
    };
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('folder', 'public/images');
    formData.append('makePublic', false);
    formData.append('functionName', 'AddUserImage');
    formData.append('functionParam', JSON.stringify(functionParam));

    try {
        const response = await apiService.uploadImage(formData);

        if (response) {
            const userIdAsString = userDetails.id.toString();
            getUserDetail(userIdAsString)
        } else {
            showToast(response.message, 'danger');
        }
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

// Function to update profile pictures on the page
function updateProfilePictures(response) {
    const profilePic = document.getElementById('profilePic');
    const profileIcon = document.getElementById('profileImg');
    const newImageUrl = response.pictureUrl!=null?response.pictureUrl:'../../assets/error.png'; // Replace with the actual key in the response
    profilePic.src = newImageUrl;
    profileIcon.src = newImageUrl;
}

// Event listener when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Hide the "No Data Found" message by default
    const noDataMessage = document.getElementById('noDataFound');
    if (noDataMessage) {
        noDataMessage.style.display = 'none';
    }

    // Retrieve user details from local storage
    userDetails = JSON.parse(localStorageService.getItem('userDetail'));
    console.log('userDetails', userDetails);

    // Display user's first name in the UI
    if (userDetails && userDetails.firstName) {
        document.getElementById('userName').innerText = userDetails.firstName;
    }

    // Display user's first and last name in the respective input fields
    if (userDetails && userDetails.firstName && userDetails.lastName) {
        document.getElementById('firstNameInput').value = userDetails.firstName;
        document.getElementById('lastNameInput').value = userDetails.lastName;
    }

    // Convert user ID to string and fetch user details
    const userIdAsString = userDetails.id.toString();
    getUserDetail(userIdAsString);
});
