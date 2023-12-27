// header.js
let userDetails
function logout() {
    localStorage.clear();
    window.location.href = '/auth/login/login.html';
}

function getUserDetail(comingId) {
    apiService.getUserDetail(comingId)
        .then(response => {
            if (response.status === 'failed') {
                showToast(response.message, 'danger');
            } else {
                updateProfilePictures(response.data[0]);
            }
        })
        .catch(error => {
            showToast(error.message, 'danger');
        });
}

async function handleFileUpload(e) {
    const fileInput = e.target;
    const functionParam = {
        userId: userDetails.id
    };
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('folder', 'public/images');
    formData.append('makePublic', true);
    formData.append('functionName', 'AddUserImage');
    formData.append('functionParam', JSON.stringify(functionParam));

    try {
        const response = await apiService.uploadImage(formData);

        if (response) {
            updateProfilePictures(response);
        } else {
            showToast(response.message, 'danger');
        }
    } catch (error) {
        showToast(error.message, 'danger');
    }
}

function updateProfilePictures(response) {
    const profilePic = document.getElementById('profilePic');
    const profileIcon = document.getElementById('profileImg');
    const newImageUrl = response.pictureUrl; // Replace with the actual key in the response
    profilePic.src = newImageUrl;
    profileIcon.src = newImageUrl;
}

document.addEventListener('DOMContentLoaded', function () {
    const noDataMessage = document.getElementById('noDataFound');
    if (noDataMessage) {
        noDataMessage.style.display = 'none';
    }
    userDetails = JSON.parse(localStorageService.getItem('userDetail'));
    console.log('userDetails',userDetails);

    if (userDetails && userDetails.firstName) {
        document.getElementById('userName').innerText = userDetails.firstName;
    }

    if (userDetails && userDetails.firstName && userDetails.lastName) {
        document.getElementById('firstNameInput').value = userDetails.firstName;
        document.getElementById('lastNameInput').value = userDetails.lastName;
    }
    const userIdAsString = userDetails.id.toString();
    getUserDetail(userIdAsString);
});