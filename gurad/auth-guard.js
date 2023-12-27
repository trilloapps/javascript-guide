function checkAccessToken() {
    const accessToken = localStorage.getItem('accessToken');

    // If access token is not present, redirect to login page
    if (!accessToken) {
        window.location.href = '/auth/login/login.html';
    }
}